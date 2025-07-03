class LatexRenderer {
    constructor() {
        this.greekLetters = {
            'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ',
                    'epsilon': 'ε', 'zeta': 'ζ', 'eta': 'η', 'theta': 'θ',
                    'iota': 'ι', 'kappa': 'κ', 'lambda': 'λ', 'mu': 'μ',
                    'nu': 'ν', 'xi': 'ξ', 'omicron': 'ο', 'pi': 'π',
                    'rho': 'ρ', 'sigma': 'σ', 'tau': 'τ', 'upsilon': 'υ',
                    'phi': 'φ', 'chi': 'χ', 'psi': 'ψ', 'omega': 'ω',
                    'Gamma': 'Γ', 'Delta': 'Δ', 'Theta': 'Θ', 'Lambda': 'Λ',
                    'Xi': 'Ξ', 'Pi': 'Π', 'Sigma': 'Σ', 'Phi': 'Φ',
                    'Psi': 'Ψ', 'Omega': 'Ω'
        };

        this.symbols = {
             'pm': '±', 'mp': '∓', 'times': '×', 'div': '÷',
                    'neq': '≠', 'leq': '≤', 'geq': '≥', 'approx': '≈',
                    'infty': '∞', 'partial': '∂', 'nabla': '∇',
                    'in': '∈', 'notin': '∉', 'subset': '⊂', 'supset': '⊃',
                    'cap': '∩', 'cup': '∪', 'int': '∫', 'sum': '∑',
                    'prod': '∏', 'cdot': '·', 'ldots': '…'
        };
    }

    render(latex) {
        try {
            let html = latex;

            // Handle matrices
            html = this.renderMatrices(html);

            // Fractions
            html = this.renderFractions(html);

            // Square roots
            html = this.renderSqrt(html);

            // Superscripts and subscripts
            html = this.renderScripts(html);

            // Integrals with limits
            html = this.renderIntegrals(html);

            // Handle sums with limits
            html = this.renderSums(html);

            // Greek letters
            html = this.renderGreekLetters(html);

            // Rest of the symbols
            html = this.renderSymbols(html);

            return html;
        } catch (error) {
            return '<span class="error">Error rendering LaTeX expression</span>';
        }
    }

    renderFractions(html) {
        // REGEX
        return html.replace(/\\frac\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
            (match, num, den) => {
                return `<span class="fraction"><span class="numerator">${this.render(num)}</span><span class="denominator">${this.render(den)}</span></span>`;
            });
    }

    renderSqrt(html) {
        return html.replace(/\\sqrt\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, 
           (match, content) => {
                return `<span class="sqrt"><span class="radicand">${this.render(content)}</span></span>`;
            });
    }

    renderScripts(html) {
         // Superscripts
        html = html.replace(/\^(\{[^{}]*\}|[^{}\s])/g, (match, script) => {
            const content = script.startsWith('{') ? script.slice(1, -1) : script;
             return `<span class="superscript">${this.render(content)}</span>`;
       });
                
        // Subscripts
        html = html.replace(/_(\{[^{}]*\}|[^{}\s])/g, (match, script) => {
            const content = script.startsWith('{') ? script.slice(1, -1) : script;
            return `<span class="subscript">${this.render(content)}</span>`;
        });
                
        return html;
    }

    renderIntegrals(html) {
        return html.replace(/\\int(?:_(\{[^{}]*\}|[^{}\s]))?(?:\^(\{[^{}]*\}|[^{}\s]))?/g,
            (match, lower, upper) => {
                let integral = '<span class="integral">∫</span>'
                if (lower) {
                    const lowerContent = lower.startsWith('{') ? lower.slice(1, -1) : lower;
                    integral += `<span class="subscript">${this.render(lowerContent)}</span>`;
                }
                if (upper) {
                    const upperContent = upper.startsWith('{') ? upper.slice(1, -1) : upper;
                    integral += `<span class="superscript">${this.render(upperContent)}</span>`;
                }
                return integral;
            });
    }

    renderSums(html) {
        return html.replace(/\\sum(?:_(\{[^{}]*\}|[^{}\s]))?(?:\^(\{[^{}]*\}|[^{}\s]))?/g,
            (match, lower, upper) => {
                let sum = '<span class="sum">∑';
                if (lower) {
                    const lowerContent = lower.startsWith('{') ? lower.slice(1, -1) : lower;
                    sum += `<span class="sum-limits sum-lower">${this.render(lowerContent)}</span>`;
                }
                if (upper) {
                    const upperContent = upper.startsWith('{') ? upper.slice(1, -1) : upper;
                    sum += `<span class="sum-limits sum-upper">${this.render(upperContent)}</span>`;
                }
                sum += '</span>';
                return sum;
            });
    }

    renderMatrices(html) {
        return html.replace(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/gs, (match, content) => {
            const rows = content.trim().split('\\\\');
            let matrixHtml = '<span class="matrix"><span class="matrix-content">';

            rows.forEach(row => {
                const cells = row.trim().split('&');
                matrixHtml += '<div class="matrix-row">';
                cells.forEach(cell => {
                    matrixHtml += `<span class="matrix-cell">${this.render(cell.trim())}</span>`;
                });
                matrixHtml += '</div>';
            });
            matrixHtml += '</span></span>';
            return matrixHtml;
        });
    }

    renderGreekLetters(html) {
        for (const [latex, unicode] of Object.entries(this.greekLetters)) {
            const regex = new RegExp(`\\\\${latex}\\b`, 'g');
            html = html.replace(regex, `<span class="greek">${unicode}</span>`);
        }
        return html;
    }

    renderSymbols(html) {
        for (const [latex, unicode] of Object.entries(this.symbols)) {
            const regex = new RegExp(`\\\\${latex}\\b`, 'g');
            html = html.replace(regex, unicode);
        }
        return html;
    }
}

const renderer = new LatexRenderer();
const input = document.getElementById("mathInput");
const output = document.getElementById("mathOutput");

function updateMath() {
    const latex = input.value;
    output.innerHTML = renderer.render(latex);
}

function setExample(latex) {
    input.value = latex;
    updateMath();
}

input.addEventListener("input", updateMath);

// Initialize render
updateMath();