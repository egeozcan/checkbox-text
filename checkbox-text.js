class CheckBoxText extends HTMLElement {
    static letterMap = {
        " ": ["00000", "00000", "00000", "00000", "00000", "00000"],
        "A": ["00100", "01010", "10001", "11111", "10001", "10001"],
        "B": ["11110", "10001", "11110", "10001", "10001", "11110"],
        "C": ["01111", "10000", "10000", "10000", "10000", "01111"],
        "D": ["11100", "10010", "10001", "10001", "10010", "11100"],
        "E": ["11111", "10000", "11111", "10000", "10000", "11111"],
        "F": ["11111", "10000", "11111", "10000", "10000", "10000"],
        "G": ["01110", "10000", "10111", "10001", "10001", "01110"],
        "H": ["10001", "10001", "11111", "10001", "10001", "10001"],
        "I": ["11111", "00100", "00100", "00100", "00100", "11111"],
        "J": ["01111", "00010", "00010", "00010", "10010", "01100"],
        "K": ["10010", "10100", "11000", "10100", "10010", "10010"],
        "L": ["10000", "10000", "10000", "10000", "10000", "11111"],
        "M": ["10001", "11011", "10101", "10001", "10001", "10001"],
        "N": ["10001", "11001", "11001", "10101", "10011", "10001"],
        "O": ["01110", "10001", "10001", "10001", "10001", "01110"],
        "P": ["11110", "10001", "10001", "11110", "10000", "10000"],
        "Q": ["01110", "10001", "10001", "10001", "01110", "00110"],
        "R": ["11110", "10001", "10001", "11110", "10010", "10001"],
        "S": ["01110", "10000", "01110", "00001", "00001", "11110"],
        "T": ["11111", "00100", "00100", "00100", "00100", "00100"],
        "U": ["10001", "10001", "10001", "10001", "10001", "01110"],
        "V": ["10001", "10001", "10001", "01010", "01010", "00100"],
        "W": ["10001", "10001", "10101", "10101", "01110", "01010"],
        "X": ["10001", "01010", "00100", "00100", "01010", "10001"],
        "Y": ["10001", "10001", "01110", "00100", "00100", "00100"],
        "Z": ["11111", "00010", "00100", "01000", "10000", "11111"],
        "0": ["01110", "10001", "10101", "10101", "10001", "01110"],
        "1": ["00100", "01100", "10100", "00100", "00100", "11111"],
        "2": ["01110", "10001", "00001", "00110", "01000", "11111"],
        "3": ["11110", "00001", "00110", "00001", "00001", "11110"],
        "4": ["10010", "10010", "11111", "00010", "00010", "00010"],
        "5": ["11111", "10000", "11110", "00001", "00001", "11110"],
        "6": ["01110", "10000", "11110", "10001", "10001", "01110"],
        "7": ["11111", "00010", "00100", "00100", "00100", "00100"],
        "8": ["01110", "10001", "01110", "10001", "10001", "01110"],
        "9": ["01110", "10001", "01111", "00001", "10001", "01110"],
        ".": ["00000", "00000", "00000", "00000", "00110", "00110"],
        ",": ["00000", "00000", "00000", "00001", "00010", "00100"],
        ":": ["00100", "00100", "00000", "00000", "00100", "00100"],
        ";": ["00000", "00110", "00110", "00000", "00110", "00110"],
        "!": ["00100", "00100", "00100", "00100", "00000", "00100"],
    }

    // language=CSS
    static style = `
        .letter {
            position: relative;
            display: inline-block;
        }
        
        .grid {
          display: inline-grid;
          grid-template-columns: repeat(5, 20px);
          grid-gap: 1px;
          margin-right: 10px;
          margin-bottom: 10px;
        }
        
        .grid.funky {
            position: absolute;
            animation: text-flicker 1s ease-in-out forwards;
            animation-iteration-count: 1;
        }

        .grid.funky + .grid.funky {
            opacity: 0;
            animation-delay: 1s;
        }

        .grid.funky + .grid.funky + .grid.funky {
            opacity: 0;
            animation-delay: 2s;
        }
        
        input[type="checkbox"] {
          width: 20px;
          height: 20px;
          border: 0;
        }
        
        /* flickering css animation */
        @keyframes text-flicker {
            0% { opacity:0.1; }
            2% { opacity:1; }
            8% { opacity:0.1; }
            9% { opacity:1; }
            12% { opacity:0.1; }
            20% { opacity:1; }
            25% { opacity:0.3; }
            30% { opacity:1; }
            70% { opacity:0.7; }
            72% { opacity:0.2; }
            77% { opacity:.9; }
            100% { opacity:0; }
        }
    `;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'text') {
            this.render();
        }
    }

    static get observedAttributes() {
        return ['text'];
    }

    render() {
        const text = (this.getAttribute('text') || '').toUpperCase();
        let finalOutput = '';

        for (const char of text) {
            let output = '';
            let outputFunky = ['', '', ''];

            if (CheckBoxText.letterMap[char]) {
                output += this.renderLetter(CheckBoxText.letterMap[char]);
                for (let i = 0; i < outputFunky.length; i++) {
                    outputFunky[i] += this.renderLetter(CheckBoxText.letterMap[char], true, i % 2 === 0 ? 0.89 : 0.34);
                }
            }

            finalOutput += `<div class="letter">${outputFunky.join('\n')}${output}</div>`;
        }

        this.shadowRoot.innerHTML = `
          <style>${CheckBoxText.style}</style>
          ${finalOutput}
        `;
    }

    renderLetter(letterMap, funky, funkyFactor = 0.34) {
        return `
          <div class="grid ${funky ? "funky" : ""}">
            ${letterMap.map(row => row.split('').map(cell => {
            let checked = cell === '1';
            
            if (funky) {
                checked = Math.random() > funkyFactor ? checked : !checked;
            }
            
            return `<input type="checkbox" ${checked ? 'checked' : ''}>`;    
            }).join('')).join('')}
          </div>
        `;
    }
}

customElements.define('check-box-text', CheckBoxText);