/**
 * Encryptr application module for DEVDEBUG OS
 * Handles various encoding, decoding, and hashing operations
 */

export function initializeEncryptrWindow(windowElement) {
    windowElement.querySelector('.window-content').innerHTML = `
              <div class="flex flex-col h-full">
                  <!-- Main Content Area -->
                  <div class="flex-grow flex p-2 space-x-2">
                      <!-- Input Area -->
                      <div class="flex flex-col w-1/2">
                          <label class="text-xs mb-1" style="color: var(--text-color-dim);">INPUT DATA:</label>
                          <textarea id="crypto-input" class="h-full p-2 bg-black text-sm overflow-y-auto whitespace-pre-wrap w-full resize-none focus:outline-none focus:ring-1" style="color: var(--primary-color); border: 1px solid var(--primary-color-dark); --ring-color: var(--primary-color);"
                              placeholder="Enter data to encode, decode, or hash..."></textarea>
                      </div>
                      <!-- Output Area -->
                      <div class="flex flex-col w-1/2">
                          <label class="text-xs mb-1" style="color: var(--text-color-dim);">OUTPUT DATA:</label>
                          <textarea id="crypto-output" class="h-full p-2 bg-black text-sm overflow-y-auto whitespace-pre-wrap w-full resize-none focus:outline-none focus:ring-1" style="color: var(--accent-color); border: 1px solid var(--primary-color-dark); --ring-color: var(--primary-color);"
                              readonly></textarea>
                      </div>
                  </div>
                  <!-- Controls Area -->
                  <div class="flex space-x-2 p-2 flex-shrink-0 justify-center" style="background-color: var(--primary-color-darker); border-top: 1px solid var(--primary-color-dark);">
                      <select id="crypto-operation" class="text-sm p-1 rounded-none" style="background-color: var(--primary-color-dark); color: var(--text-color-dim); border: 1px solid var(--primary-color-dark);">
                          <option value="b64e">Base64 Encode</option>
                          <option value="b64d">Base64 Decode</option>
                          <option value="hexe">Hex Encode</option>
                          <option value="hexd">Hex Decode</option>
                          <option value="rot13">ROT13 Cipher</option>
                          <option value="rot47">ROT47 Cipher</option>
                          <option value="md5">Hash (MD5 Sim)</option>
                          <option value="sha256">Hash (SHA-256 Sim)</option>
                          <option value="qrcode">Generate QR Code</option>
                      </select>
                      <button id="crypto-run-btn" class="text-black font-bold py-2 px-3 rounded-none transition-colors text-sm border border-black" style="background-color: var(--primary-color);">Execute Operation</button>
                  </div>
              </div>
          `;

    const inputField = windowElement.querySelector('#crypto-input');
    const outputField = windowElement.querySelector('#crypto-output');
    const operationSelect = windowElement.querySelector('#crypto-operation');
    const runBtn = windowElement.querySelector('#crypto-run-btn');

    const rot13 = (s) => s.replace(/[a-zA-Z]/g, (c) =>
        String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() <= 'm' ? 13 : -13)));

    const rot47 = (s) => s.replace(/[\u0021-\u007E]/g, (c) =>
        String.fromCharCode(((c.charCodeAt(0) - 33 + 47) % 94) + 33));

    const hexEncode = (s) => {
        let result = '';
        for (let i = 0; i < s.length; i++) {
            result += s.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return result;
    };

    const hexDecode = (s) => {
        const cleanHex = s.replace(/[^0-9A-Fa-f]/g, '');
        if (cleanHex.length % 2 !== 0) {
            throw new Error('Invalid hex string length');
        }
        let result = '';
        for (let i = 0; i < cleanHex.length; i += 2) {
            const hexPair = cleanHex.substr(i, 2);
            result += String.fromCharCode(parseInt(hexPair, 16));
        }
        return result;
    };

    const md5 = (input) => {
        const k = [], a = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476];
        for (let i = 0; i < 64; i++) k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
        let str = unescape(encodeURIComponent(input));
        let x = [];
        for (let i = 0; i < str.length; i++) x.push(str.charCodeAt(i));
        x.push(0x80);
        while ((x.length % 64) !== 56) x.push(0);
        let len = str.length * 8;
        for (let i = 0; i < 8; i++) x.push((len >>> (i * 8)) & 0xFF);
        const r = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
        for (let i = 0; i < x.length; i += 64) {
            let o = a.slice(0);
            for (let j = 0; j < 64; j++) {
                let f, g;
                if (j < 16) { f = (o[1] & o[2]) | ((~o[1]) & o[3]); g = j; }
                else if (j < 32) { f = (o[3] & o[1]) | ((~o[3]) & o[2]); g = (5 * j + 1) % 16; }
                else if (j < 48) { f = o[1] ^ o[2] ^ o[3]; g = (3 * j + 5) % 16; }
                else { f = o[2] ^ (o[1] | (~o[3])); g = (7 * j) % 16; }
                const w = x[i + g * 4] | (x[i + g * 4 + 1] << 8) | (x[i + g * 4 + 2] << 16) | (x[i + g * 4 + 3] << 24);
                const rot = r[(Math.floor(j / 16) * 4) + (j % 4)];
                const temp = (o[0] + f + k[j] + w) >>> 0;
                const t = (o[1] + ((temp << rot) | (temp >>> (32 - rot)))) >>> 0;
                o[0] = o[3]; o[3] = o[2]; o[2] = o[1]; o[1] = t;
            }
            for (let j = 0; j < 4; j++) a[j] = (a[j] + o[j]) >>> 0;
        }
        return a.map(n => {
            let hex = '';
            for (let i = 0; i < 4; i++) hex += ((n >>> (i * 8)) & 0xFF).toString(16).padStart(2, '0');
            return hex;
        }).join('');
    };

    const generateQRCode = (text) => {
        const encodedText = encodeURIComponent(text);
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}`;
    };

    const executeOperation = async () => {
        const inputData = inputField.value;
        const operation = operationSelect.value;
        let outputData = '';

        try {
            switch (operation) {
                case 'b64e':
                    outputData = btoa(inputData);
                    break;
                case 'b64d':
                    outputData = atob(inputData);
                    break;
                case 'hexe':
                    outputData = hexEncode(inputData);
                    break;
                case 'hexd':
                    outputData = hexDecode(inputData);
                    break;
                case 'rot13':
                    outputData = rot13(inputData);
                    break;
                case 'rot47':
                    outputData = rot47(inputData);
                    break;
                case 'md5':
                    outputData = md5(inputData);
                    break;
                case 'sha256':
                    const msgBuffer = new TextEncoder().encode(inputData);
                    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
                    outputData = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
                    break;
                case 'qrcode':
                    outputData = generateQRCode(inputData);
                    break;
                default:
                    outputData = "ERROR: Unknown Operation.";
            }
        } catch (e) {
            outputData = "ERROR: Data format invalid for decoding or processing failed.";
            console.error(e);
        }

        if (operation === 'qrcode') {
            const qrContainer = document.createElement('div');
            qrContainer.style.display = 'flex';
            qrContainer.style.justifyContent = 'center';
            qrContainer.style.alignItems = 'center';
            qrContainer.style.height = '100%';
            qrContainer.style.width = '100%';

            const qrImage = document.createElement('img');
            qrImage.src = outputData;
            qrImage.alt = 'QR Code';
            qrImage.style.maxWidth = '100%';
            qrImage.style.maxHeight = '100%';

            qrContainer.appendChild(qrImage);
            const parent = outputField.parentNode;
            parent.replaceChild(qrContainer, outputField);
            outputField._qrContainer = qrContainer;
        } else {
            if (outputField._qrContainer) {
                const parent = outputField._qrContainer.parentNode;
                if (parent) {
                    parent.replaceChild(outputField, outputField._qrContainer);
                }
                outputField._qrContainer = null;
            }
            outputField.value = outputData;
            outputField.style.backgroundColor = 'black';
            outputField.style.color = 'var(--accent-color)';
        }
    };

    runBtn.addEventListener('click', executeOperation);
}
