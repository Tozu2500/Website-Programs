 class XMLLoader {
            constructor() {
                this.initializeElements();
                this.bindEvents();
                this.createSampleXML();
            }

            initializeElements() {
                this.fileInput = document.getElementById('xmlFile');
                this.urlInput = document.getElementById('xmlUrl');
                this.loadBtn = document.getElementById('loadBtn');
                this.clearBtn = document.getElementById('clearBtn');
                this.sampleBtn = document.getElementById('sampleBtn');
                this.loading = document.getElementById('loading');
                this.errorContainer = document.getElementById('errorContainer');
                this.dataDisplay = document.getElementById('dataDisplay');
                this.xmlContent = document.getElementById('xmlContent');
            }

            bindEvents() {
                this.loadBtn.addEventListener('click', () => this.handleLoadClick());
                this.clearBtn.addEventListener('click', () => this.clearData());
                this.sampleBtn.addEventListener('click', () => this.loadSampleData());
                this.fileInput.addEventListener('change', () => this.handleFileChange());
            }

            createSampleXML() {
                this.sampleXMLData = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
    <book id="1" category="fiction">
        <title>The Great Adventure</title>
        <author>John Smith</author>
        <year>2023</year>
        <price currency="USD">24.99</price>
        <description>An epic tale of courage and discovery</description>
    </book>
    <book id="2" category="science">
        <title>Future Technologies</title>
        <author>Dr. Sarah Johnson</author>
        <year>2024</year>
        <price currency="USD">39.99</price>
        <description>Exploring the latest in tech innovation</description>
    </book>
    <book id="3" category="history">
        <title>Ancient Civilizations</title>
        <author>Michael Brown</author>
        <year>2022</year>
        <price currency="USD">29.99</price>
        <description>A journey through time and culture</description>
    </book>
</catalog>`;
            }

            // Promise-based XML loading from URL
            loadXMLFromURL(url) {
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    
                    xhr.open('GET', url, true);
                    xhr.responseType = 'document';
                    xhr.overrideMimeType('text/xml');

                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            if (xhr.responseXML) {
                                resolve(xhr.responseXML);
                            } else {
                                // Fallback: parse as text
                                const parser = new DOMParser();
                                const xmlDoc = parser.parseFromString(xhr.responseText, 'text/xml');
                                const parseError = xmlDoc.getElementsByTagName('parsererror');
                                
                                if (parseError.length > 0) {
                                    reject(new Error('Invalid XML format'));
                                } else {
                                    resolve(xmlDoc);
                                }
                            }
                        } else {
                            reject(new Error(`HTTP Error: ${xhr.status} - ${xhr.statusText}`));
                        }
                    };

                    xhr.onerror = () => {
                        reject(new Error('Network error occurred while loading XML'));
                    };

                    xhr.ontimeout = () => {
                        reject(new Error('Request timeout'));
                    };

                    xhr.timeout = 10000; // 10 second timeout
                    xhr.send();
                });
            }

            // Promise-based XML loading from file
            loadXMLFromFile(file) {
                return new Promise((resolve, reject) => {
                    if (!file.type.includes('xml') && !file.name.endsWith('.xml')) {
                        reject(new Error('Please select a valid XML file'));
                        return;
                    }

                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        try {
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(e.target.result, 'text/xml');
                            const parseError = xmlDoc.getElementsByTagName('parsererror');
                            
                            if (parseError.length > 0) {
                                reject(new Error('Invalid XML format in file'));
                            } else {
                                resolve(xmlDoc);
                            }
                        } catch (error) {
                            reject(new Error('Error parsing XML file: ' + error.message));
                        }
                    };

                    reader.onerror = () => {
                        reject(new Error('Error reading file'));
                    };

                    reader.readAsText(file);
                });
            }

            // Promise-based sample XML loading
            loadSampleXML() {
                return new Promise((resolve, reject) => {
                    try {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(this.sampleXMLData, 'text/xml');
                        const parseError = xmlDoc.getElementsByTagName('parsererror');
                        
                        if (parseError.length > 0) {
                            reject(new Error('Error in sample XML data'));
                        } else {
                            // Simulate network delay for demonstration
                            setTimeout(() => resolve(xmlDoc), 800);
                        }
                    } catch (error) {
                        reject(new Error('Error creating sample XML: ' + error.message));
                    }
                });
            }

            async handleLoadClick() {
                this.clearErrors();

                try {
                    let xmlDoc;

                    if (this.fileInput.files.length > 0) {
                        xmlDoc = await this.loadXMLWithProgress(
                            () => this.loadXMLFromFile(this.fileInput.files[0])
                        );
                    } else if (this.urlInput.value.trim()) {
                        xmlDoc = await this.loadXMLWithProgress(
                            () => this.loadXMLFromURL(this.urlInput.value.trim())
                        );
                    } else {
                        throw new Error('Please select a file or enter a URL');
                    }

                    this.displayXML(xmlDoc);
                } catch (error) {
                    this.showError(error.message);
                }
            }

            async loadSampleData() {
                this.clearErrors();
                try {
                    const xmlDoc = await this.loadXMLWithProgress(() => this.loadSampleXML());
                    this.displayXML(xmlDoc);
                } catch (error) {
                    this.showError(error.message);
                }
            }

            async loadXMLWithProgress(loadFunction) {
                this.showLoading();
                try {
                    const result = await loadFunction();
                    return result;
                } finally {
                    this.hideLoading();
                }
            }

            displayXML(xmlDoc) {
                const xmlString = this.formatXML(xmlDoc);
                this.xmlContent.innerHTML = xmlString;
                this.dataDisplay.classList.add('visible');
                
                // Smooth scroll to results
                this.dataDisplay.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }

            formatXML(xmlDoc) {
                const serializer = new XMLSerializer();
                const xmlString = serializer.serializeToString(xmlDoc);
                
                // Pretty print the XML
                return this.syntaxHighlight(this.formatXMLString(xmlString));
            }

            formatXMLString(xml) {
                let formatted = '';
                let indent = '';
                const tab = '  ';
                
                xml.split(/>\s*</).forEach((node) => {
                    if (node.match(/^\/\w/)) {
                        indent = indent.substring(tab.length);
                    }
                    
                    formatted += indent + '<' + node + '>\n';
                    
                    if (node.match(/^<?\w[^>]*[^\/]$/)) {
                        indent += tab;
                    }
                });
                
                return formatted.substring(1, formatted.length - 3);
            }

            syntaxHighlight(xml) {
                return xml
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/(".*?")/g, '<span class="xml-attribute">$1</span>')
                    .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="xml-tag">$2</span>')
                    .replace(/(&gt;)([^&lt;]+)(&lt;)/g, '$1<span class="xml-text">$2</span>$3');
            }

            showLoading() {
                this.loading.classList.add('active');
                this.loadBtn.disabled = true;
            }

            hideLoading() {
                this.loading.classList.remove('active');
                this.loadBtn.disabled = false;
            }

            showError(message) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error';
                errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
                this.errorContainer.appendChild(errorDiv);
            }

            clearErrors() {
                this.errorContainer.innerHTML = '';
            }

            clearData() {
                this.dataDisplay.classList.remove('visible');
                this.xmlContent.innerHTML = '';
                this.fileInput.value = '';
                this.urlInput.value = '';
                this.clearErrors();
            }

            handleFileChange() {
                if (this.fileInput.files.length > 0) {
                    this.urlInput.value = '';
                }
            }
        }

        // Initialize the XML Loader when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            new XMLLoader();
        });