"use strict";

const width = 9100;
const height = 6100;
const elements = Object.freeze(["n", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"]);
const names = Object.freeze(["Neutron", "Hydrogen", "Helium", "Lithium", "Beryllium", "Boron", "Carbon", "Nitrogen", "Oxygen", "Fluroine", "Neon", "Sodium", "Magnesium", "Aluminium", "Silicon", "Phosphorus", "Sulfur", "Chlorine", "Argon", "Potassium", "Calcium", "Scandium", "Titanium", "Vanadium", "Chromium", "Manganese", "Iron", "Cobalt", "Nickel", "Copper", "Zinc", "Gallium", "Germanium", "Arsenic", "Selenium", "Bromine", "Krypton", "Rubidium", "Strontium", "Yttrium", "Zirconium", "Niobium", "Molybdenum", "Technetium", "Ruthenium", "Rhodium", "Palladium", "Silver", "Cadmium", "Indium", "Tin", "Antimony", "Tellurium", "Iodine", "Xenon", "Caesium", "Barium", "Lanthanum", "Cerium", "Praseodymium", "Neodymium", "Promethium", "Samarium", "Europium", "Gadolinium", "Terbium", "Dysprosium", "Holmium", "Erbium", "Thulium", "Ytterbium", "Lutetium", "Hafnium", "Tantalum", "Tungsten", "Rhenium", "Osmium", "Iridium", "Platinum", "Gold", "Mercury", "Thallium", "Lead", "Bismuth", "Polonium", "Astatine", "Radon", "Francium", "Radium", "Actinium", "Thorium", "Protactinium", "Uranium", "Neptunium", "Plutonium", "Americium", "Curium", "Berkelium", "Californium", "Einsteinium", "Fermium", "Mendelevium", "Nobelium", "Lawrencium", "Rutherfordium", "Dubnium", "Seaborgium", "Bohrium", "Hassium", "Meitnerium", "Darmstadtium", "Roentgenium", "Copernicium", "Nihonium", "Flerovium", "Moscovium", "Livermorium", "Tennessine", "Oganesson"]);
const placeholders = Object.freeze(["n", "u", "b", "t", "q", "p", "h", "s", "o", "e"]);
const placeholderNames = Object.freeze(["nil", "un", "bi", "tri", "quad", "pent", "hex", "sept", "oct", "enn"]);

class Nuclide{
    nulcide;
    z;
    n;
    decayMode;
    secondaryDecayMode;
    tertiaryDecayMode;
    halfLife;
    jp;
    abundance;

    constructor(data){
        const dataArray = data.split(";");
        this.nuclide = dataArray[0];
        this.z = parseInt(dataArray[1]);
        this.n = parseInt(dataArray[2]);
        this.decayMode = new DecayMode(dataArray[3], dataArray[4] != "");
        this.secondaryDecayMode = dataArray[4] ? new DecayMode(dataArray[4], true) : null;
        this.tertiaryDecayMode = dataArray[5] ? new DecayMode(dataArray[5], true) : null;
        this.halfLife = dataArray[6];
        this.jp = dataArray[7];
        this.abundance = parseFloat(dataArray[8]) || null;
    }

    get a(){
        return this.z + this.n;
    }

    get element(){
        if(this.z < elements.length){
            return elements[this.z];
        }
        let placeholder = "";
        for(digit of this.z.toString()){
            placeholder += placeholders[digit];
        }
        return placeholder[0].toUpperCase() + placeholder.slice(1);
    }

    get name(){
        let elementName = "";
        if(this.z < names.length){
            elementName = names[this.z];
        }
        else{
            for(digit of this.z.toString()){
                elementName += placeholderNames[digit];
            }
            elementName = elementName.replace("ii", "i").replace("nnn", "n");
            elementName = elementName[0].toUpperCase + elementName.slice(1) + "ium";
        }
        return elementName + "-" + this.a;
    }
}

class DecayMode{
    className;
    name;
    frequency;

    constructor(data, hasMultipleDecayModes){
        const dataArray = data.split(":");
        this.className = dataArray[0].trim().replace("-", "minus").replace("+", "plus").replace("2", "double");

        if(this.className == "a"){
            this.name = "\u03b1";
        }
        else if(/\+|\-/.test(dataArray[0])){
            this.name = dataArray[0].replace("b", "\u03b2");
        }
        else{
            this.name = this.className;
        }
        this.className = this.className.toLowerCase();

        if(dataArray.length == 1){
            if(hasMultipleDecayModes){
                this.frequency = null;
            }
            else{
                this.frequency = 100;
            }
        }
        else{
            this.frequency = parseFloat(dataArray[1].trim());
        }
    }
}

function createChart(data){
    const nuclides = data.split(/[\r\n]+/);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);

    for(let nuclideData of nuclides.slice(1)){
        if(nuclideData == ""){
            continue;
        }

        const nuclide = new Nuclide(nuclideData);

        const a = document.createElementNS("http://www.w3.org/2000/svg", "a");
        a.setAttribute("href", "https://www.nndc.bnl.gov/nudat3/" + (nuclide.decayMode.className == "stable" ? "getdataset.jsp?nucleus" : "decaysearchdirect.jsp?nuc") + "=" + nuclide.a + elements[nuclide.z]);
        a.setAttribute("target", "_blank");
        a.setAttribute("transform", "translate(" + (nuclide.n + 0.1) * 51 + "," + (height - (nuclide.z + 1) * 51) + ")");

        //Color the nuclide by decay mode
        if(nuclide.secondaryDecayMode == null || nuclide.secondaryDecayMode.frequency < 5){
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("width", 50);
            rect.setAttribute("height", 50);
            rect.setAttribute("x", 0);
            rect.setAttribute("y", 0);
            rect.setAttribute("class", "box " + nuclide.decayMode.className);
            a.appendChild(rect);
        }
        else{
            const primaryPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            primaryPath.setAttribute("d", "M0 50 L0 0 L50 0 Z");
            primaryPath.setAttribute("class", "box " + nuclide.decayMode.className);
            a.appendChild(primaryPath);

            const secondaryPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            secondaryPath.setAttribute("d", "M0 50 L50 50 L50 0 Z");
            secondaryPath.setAttribute("class", "box " + nuclide.secondaryDecayMode.className);
            a.appendChild(secondaryPath);
        }

        //If the nuclide is almost stable, create a black border around it
        if(/E\+?([1-9][0-9]|[89])\s*y$/i.test(nuclide.halfLife)){
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("width", 46);
            rect.setAttribute("height", 46);
            rect.setAttribute("x", 2);
            rect.setAttribute("y", 2);
            rect.setAttribute("stroke", "black");
            rect.setAttribute("stroke-width", 4);
            rect.setAttribute("fill", "none");
            a.appendChild(rect);
        }

        //Write the element and isotope
        const elementAndIsotope = document.createElementNS("http://www.w3.org/2000/svg", "text");
        elementAndIsotope.setAttribute("x", 25);
        elementAndIsotope.setAttribute("y", 22);

        const isotope = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        isotope.setAttribute("dy", -10);
        isotope.setAttribute("class", "isotope");
        isotope.textContent = nuclide.a;
        elementAndIsotope.appendChild(isotope);
        
        const element = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        element.setAttribute("dy", 10);
        element.setAttribute("class", "element");
        element.textContent = nuclide.element;
        elementAndIsotope.appendChild(element);

        a.appendChild(elementAndIsotope);

        //Add the name of the nuclide as title text
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = nuclide.name;
        a.appendChild(title);

        //Decay mode
        const decayMode = document.createElementNS("http://www.w3.org/2000/svg", "text");
        decayMode.setAttribute("x", 25);
        decayMode.setAttribute("y", 31);
        decayMode.setAttribute("class", "details");
        decayMode.textContent = nuclide.decayMode.name;
        if(nuclide.secondaryDecayMode != null){
            if(nuclide.decayMode.frequency != null){
                decayMode.textContent += " (" + nuclide.decayMode.frequency + "%)";
            }
            decayMode.textContent += ",";
            a.appendChild(decayMode);

            const secondaryDecayMode = document.createElementNS("http://www.w3.org/2000/svg", "text");
            secondaryDecayMode.setAttribute("x", 25);
            secondaryDecayMode.setAttribute("y", 39);
            secondaryDecayMode.setAttribute("class", "details");
            secondaryDecayMode.textContent = nuclide.secondaryDecayMode.name;
            if(nuclide.secondaryDecayMode.frequency != null){
                secondaryDecayMode.textContent += " (" + nuclide.secondaryDecayMode.frequency + "%)";
            }
            a.appendChild(secondaryDecayMode);
        }
        else{
            a.appendChild(decayMode);

            //Abundance
            if(nuclide.abundance != null){
                const abundance = document.createElementNS("http://www.w3.org/2000/svg", "text");
                abundance.setAttribute("x", 25);
                abundance.setAttribute("y", 39);
                abundance.setAttribute("class", "details");
                abundance.textContent = nuclide.abundance + "%";
                a.appendChild(abundance);
            }
        }

        //Half-life
        if(nuclide.halfLife != "stable"){
            const abundance = document.createElementNS("http://www.w3.org/2000/svg", "text");
            abundance.setAttribute("x", 25);
            abundance.setAttribute("y", 47);
            abundance.setAttribute("class", "details");
            abundance.textContent = nuclide.halfLife;
            a.appendChild(abundance);
        }

        svg.appendChild(a);
    }

    //Magic numbers
    const protonMagicNumbers = Object.freeze([2, 8, 20, 28, 50, 82]);
    for(let magicNumber of protonMagicNumbers){
        const y1 = height - (magicNumber + 1) * 51;
        const y2 = height - (magicNumber) * 51;

        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line1.setAttribute("class", "magicNumber");
        line1.setAttribute("x1", 0);
        line1.setAttribute("x2", width);
        line1.setAttribute("y1", y1);
        line1.setAttribute("y2", y1);
        svg.appendChild(line1);
        
        const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line2.setAttribute("class", "magicNumber");
        line2.setAttribute("x1", 0);
        line2.setAttribute("x2", width);
        line2.setAttribute("y1", y2);
        line2.setAttribute("y2", y2);
        svg.appendChild(line2);
    }

    const neutronMagicNumbers = Object.freeze([2, 8, 20, 28, 50, 82, 126]);
    for(let magicNumber of neutronMagicNumbers){
        const x1 = (magicNumber + 1.1) * 51;
        const x2 = (magicNumber + 0.1) * 51;

        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line1.setAttribute("class", "magicNumber");
        line1.setAttribute("x1", x1);
        line1.setAttribute("x2", x1);
        line1.setAttribute("y1", 0);
        line1.setAttribute("y2", height);
        svg.appendChild(line1);
        
        const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line2.setAttribute("class", "magicNumber");
        line2.setAttribute("x1", x2);
        line2.setAttribute("x2", x2);
        line2.setAttribute("y1", 0);
        line2.setAttribute("y2", height);
        svg.appendChild(line2);
    }

    return svg;
}

window.addEventListener("load", () => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if(xhr.readyState == XMLHttpRequest.DONE){
            //Set up the chart
            const chart = createChart(xhr.responseText);

            const container = document.getElementById("container");
            document.getElementById("loading").style.display = "none";
            container.style.display = "";
            container.appendChild(chart);

            //Allow downloading the chart
            //TODO: remove the string and uncomment the end of the line
            const css = [...[...document.styleSheets].find(s => s.href?.endsWith("chartstyle.css")).cssRules].map(r => r.cssText).join("");

            const downloadChart = document.getElementById("downloadChart");
            downloadChart.disabled = false;
            downloadChart.href = "data:image/svg+xml;utf8," + encodeURIComponent(chart.outerHTML.replace("<svg ", "<svg xmlns=\"http://www.w3.org/2000/svg\" ").replace("><", "><style type=\"text/css\">" + css + "</style><"));

            //Set the scrolling
            let oldScrollLeft = container.scrollLeft = localStorage.getItem("scrollLeft") ?? width * 0.5;
            let oldScrollTop = container.scrollTop = localStorage.getItem("scrollTop") ?? height * 0.35;

            //Change the cursor when dragging to scroll
            chart.onmousedown = (event) => {
                dragToScroll(event, container);
                chart.style.cursor = "move";
            };
            chart.onmouseup = (event) => {
                if(oldScrollLeft != container.scrollLeft || oldScrollTop != container.scrollTop){
                    event.preventDefault();
                    oldScrollLeft = container.scrollLeft;
                    oldScrollTop = container.scrollTop;
                }
                else{
                    chart.style.cursor = "";
                }
            };
            window.addEventListener("click", (event) => {
                chart.style.cursor = "";
            });

            //When scrolling, store the new position so that the user can start again where he left off
            container.onscroll = () => {
                if(chart.getAttribute("width") == width && chart.getAttribute("height") == height){
                    localStorage.setItem("scrollLeft", container.scrollLeft);
                    localStorage.setItem("scrollTop", container.scrollTop);
                }
            };

            //Do so that scrolling by dragging doesn't open the links
            for(let a of chart.getElementsByTagName("a")){
                a.addEventListener("click", (event) => {
                    if(chart.style.cursor == "move"){
                        event.preventDefault();
                    }
                });
                a.addEventListener("mousedown", () => {
                    a.style.cursor = "move";
                });
                a.addEventListener("mouseup", () => {
                    a.style.cursor = "";
                });
            }

            //Enable zooming
            const zoomInput = document.getElementById('zoomInput');
            document.getElementById("zoomOut").onclick = () => changeZoom(chart, container, -2, null, 1, zoomInput);
            document.getElementById("zoomIn").onclick = () => changeZoom(chart, container, 2, null, 1, zoomInput);
            zoomInput.oninput = () => setZoom(chart, container, zoomInput.value / zoomInput.max * (1 - autoMinZoom(chart, container)) + autoMinZoom(chart, container), null, 1);
            container.onwheel = (event) => zoom(event, chart, null, 1, zoomInput);
        }
    };

    xhr.open("GET", "data.csv");
    xhr.send(null);
});
