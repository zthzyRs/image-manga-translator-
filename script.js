const imageInput = document.getElementById('image-input');
const translateBtn = document.getElementById('translate-btn');
const outputDiv = document.getElementById('output');
const downloadBtn = document.getElementById('download-btn');

let translations = [];

function fakeTranslate(text) {
    // ترجمة تجريبية (يمكن ربط API مجاني أو استخدام خدمات مثل LibreTranslate)
    // ستحتاج لبناء نسخة نهائية عند توفر API ترجمة مجاني!
    return text.split('').reverse().join('');
}

async function processImages(files) {
    outputDiv.innerHTML = '';
    translations = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imgURL = URL.createObjectURL(file);
        const img = document.createElement('img');
        img.src = imgURL;
        img.onload = () => URL.revokeObjectURL(imgURL);

        const block = document.createElement('div');
        block.className = 'result-block';
        block.appendChild(img);

        const status = document.createElement('p');
        status.textContent = 'جاري استخراج النص...';
        block.appendChild(status);

        outputDiv.appendChild(block);

        // OCR باستخدام Tesseract.js
        const worker = Tesseract.createWorker('ara+eng');
        await worker.load();
        await worker.loadLanguage('ara+eng');
        await worker.initialize('ara+eng');
        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();
        
        status.textContent = 'تم استخراج النص! جاري الترجمة...';

        // ترجمة النص (استبدل fakeTranslate بترجمة فعلية لاحقاً)
        const translated = fakeTranslate(text);

        const txt = document.createElement('textarea');
        txt.value = translated;
        txt.rows = 4;
        txt.style.width = '90%';
        block.appendChild(txt);

        translations.push(`-- الصورة ${i+1} --\n${translated}\n\n`);
        status.textContent = 'تمت الترجمة!';
    }
    downloadBtn.style.display = 'inline-block';
}

translateBtn.onclick = async () => {
    const files = imageInput.files;
    if (!files.length) {
        alert('يرجى اختيار صور أولاً');
        return;
    }
    if (files.length > 50) {
        alert('يمكنك رفع 50 صورة كحد أقصى دفعة واحدة.');
        return;
    }
    await processImages(files);
}

downloadBtn.onclick = () => {
    const blob = new Blob([translations.join('\n')], {type: 'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'translations.txt';
    a.click();
}
