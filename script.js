function simulate(type) {
    let bits = document.getElementById("bitInput").value.split("").map(Number);
    let result = (type === 'b8zs') ? b8zsScramble(bits) : hdb3Scramble(bits);
    plotSignal(bits, result);
    updateDescription(type);
}

function b8zsScramble(bits) {
    let encoded = [...bits], prevPulse = -1, zeroCount = 0, bPositions = [], vPositions = [];

    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === 1) {
            prevPulse = -prevPulse;
            encoded[i] = prevPulse;
            zeroCount = 0;
        } else {
            zeroCount++;
            if (zeroCount === 8) {
                zeroCount = 0;
                encoded.splice(i - 7, 8, 0, 0, 0, prevPulse, -prevPulse, 0, -prevPulse, prevPulse);
                vPositions.push(i - 4, i - 1);
                bPositions.push(i - 3, i);
                prevPulse = encoded[i];
            }
        }
    }
    return { encoded, bPositions, vPositions };
}

function hdb3Scramble(bits) {
    let encoded = new Array(bits.length).fill(0);
    let prevPulse = -1, zeroCount = 0, oneCount = 0, bPositions = [], vPositions = [];

    for (let i = 0; i < bits.length; i++) {
        if (bits[i] === 1) {
            prevPulse = -prevPulse;
            encoded[i] = prevPulse;
            zeroCount = 0;
            oneCount++;
        } else {
            zeroCount++;
            if (zeroCount === 4) {
                zeroCount = 0;
                if (oneCount % 2 === 0) {
                    encoded[i - 3] = -prevPulse;
                    encoded[i] = -prevPulse;
                    bPositions.push(i - 3);
                    vPositions.push(i);
                    oneCount+=2;
                } else {
                    encoded[i] = prevPulse;
                    vPositions.push(i);
                    oneCount++;
                }
                prevPulse = encoded[i];
            }
        }
    }
    return { encoded, bPositions, vPositions };
}
function updateDescription(type) {
    const desc = document.getElementById("descriptionText");
    if (type === "b8zs") {
        desc.innerHTML = `
            <strong>B8ZS (Bipolar with 8-Zero Substitution):</strong><br>
            - When 8 consecutive 0s occur, they are replaced by <code>000VB0VB</code>.<br>
            - <strong>V</strong>: Violation (same polarity as the previous 1).<br>
            - <strong>B</strong>: Bipolar pulse (opposite polarity of the previous 1).
        `;
    } else {
        desc.innerHTML = `
            <strong>HDB3 (High Density Bipolar 3-Zero Substitution):</strong><br>
            - When 4 consecutive 0s occur:<br>
            - <strong>If even</strong> number of 1s since last substitution → <code>B00V</code>.<br>
            - <strong>If odd</strong> number of 1s since last substitution → <code>000V</code>.<br>
            - <strong>B</strong>: Opposite polarity of last 1, <strong>V</strong>: Same polarity as last 1.
        `;
    }
}
async function animateSignal(bits, result) {
        let { encoded, bPositions, vPositions } = result;
        let svg = d3.select("#chart");
        svg.selectAll("*").remove();

        let scaleX = d3.scaleLinear().domain([0, bits.length]).range([50, 850]);
        let scaleY = d3.scaleLinear().domain([-1.5, 1.5]).range([300, 50]);

        // Draw grid
        for (let i = 0; i <= bits.length; i++) {
            svg.append("line").attr("x1", scaleX(i)).attr("x2", scaleX(i))
                .attr("y1", 50).attr("y2", 300).attr("stroke", "#ddd");
        }
        for (let i = -1; i <= 1; i++) {
            svg.append("line").attr("x1", 50).attr("x2", 850)
                .attr("y1", scaleY(i)).attr("y2", scaleY(i)).attr("stroke", "#ddd");
        }

        // Add bit labels
        bits.forEach((bit, i) => {
            svg.append("text")
                .attr("x", scaleX(i) + 23)
                .attr("y", 40)
                .text(bit)
                .attr("fill", "black")
                .attr("font-size", "14px")
                .attr("font-weight", "bold");
        });

        let pathData = [];

        for (let i = 0; i <= bits.length; i++) {
            pathData.push(encoded[i]);
            if (i > 0) {
                pathData[i] = encoded[i - 1]; // Hold until next bit
            }

            let line = d3.line()
                .x((d, idx) => scaleX(idx))
                .y(d => scaleY(d))
                .curve(d3.curveStepAfter);

            svg.selectAll(".signal").remove();
            svg.append("path")
                .datum(pathData)
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("stroke-width", 2)
                .attr("class", "signal")
                .attr("d", line);

            await new Promise(resolve => setTimeout(resolve, 300)); // Delay
        }

        // Add B/V labels
        bPositions.forEach(pos => {
            svg.append("text")
                .attr("x", scaleX(pos))
                .attr("y", scaleY(encoded[pos]) - 10)
                .text("B")
                .attr("fill", "green")
                .attr("font-weight", "bold");
        });

        vPositions.forEach(pos => {
            svg.append("text")
                .attr("x", scaleX(pos))
                .attr("y", scaleY(encoded[pos]) - 10)
                .text("V")
                .attr("fill", "red")
                .attr("font-weight", "bold");
        });
    }

    function plotSignal(bits, result) {
        let { encoded, bPositions, vPositions } = result;
        let svg = d3.select("#chart");
        svg.selectAll("*").remove();
    
        let scaleX = d3.scaleLinear().domain([0, bits.length]).range([50, 850]);
        let scaleY = d3.scaleLinear().domain([-1.5, 1.5]).range([300, 50]);
    
        // Draw grid
        for (let i = 0; i <= bits.length; i++) {
            svg.append("line")
                .attr("x1", scaleX(i))
                .attr("x2", scaleX(i))
                .attr("y1", 50)
                .attr("y2", 300)
                .attr("stroke", "#ddd");
        }
        for (let i = -1; i <= 1; i++) {
            svg.append("line")
                .attr("x1", 50)
                .attr("x2", 850)
                .attr("y1", scaleY(i))
                .attr("y2", scaleY(i))
                .attr("stroke", "#ddd");
        }
    
        let extendedEncoded = [...encoded, encoded[encoded.length - 1]];
    
        let line = d3.line()
            .x((d, i) => scaleX(i))
            .y(d => scaleY(d))
            .curve(d3.curveStepAfter);
    
        svg.append("path")
            .datum(extendedEncoded)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 2)
            .attr("d", line);
    
        svg.append("line")
            .attr("x1", scaleX(bits.length - 1))
            .attr("x2", scaleX(bits.length))
            .attr("y1", scaleY(encoded[encoded.length - 1]))
            .attr("y2", scaleY(encoded[encoded.length - 1]))
            .attr("stroke", "blue")
            .attr("stroke-width", 2);
    
        // Bit labels above graph
        bits.forEach((bit, i) => {
            svg.append("text")
                .attr("x", scaleX(i) + 23)
                .attr("y", 40)
                .text(bit)
                .attr("fill", "black")
                .attr("font-size", "14px")
                .attr("font-weight", "bold");
        });
    
        // Draw B positions (green)
        bPositions.forEach(pos => {
            svg.append("text")
                .attr("x", scaleX(pos) + 23)
                .attr("y", scaleY(encoded[pos]) - 10)
                .text("B")
                .attr("fill", "green")
                .attr("font-size", "14px")
                .attr("font-weight", "bold");
        });
    
        // Draw V positions (red)
        vPositions.forEach(pos => {
            svg.append("text")
                .attr("x", scaleX(pos) + 23)
                .attr("y", scaleY(encoded[pos]) - 10)
                .text("V")
                .attr("fill", "red")
                .attr("font-size", "14px")
                .attr("font-weight", "bold");
        });
    }
    