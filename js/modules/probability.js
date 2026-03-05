// probability.js

export function setOperations(setA, setB) {
    const union = new Set([...setA, ...setB]);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const differenceAB = new Set([...setA].filter(x => !setB.has(x)));
    const differenceBA = new Set([...setB].filter(x => !setA.has(x)));

    return {
        union: Array.from(union).sort().join(', '),
        intersection: Array.from(intersection).sort().join(', ') || 'Ø',
        diffAB: Array.from(differenceAB).sort().join(', ') || 'Ø',
        diffBA: Array.from(differenceBA).sort().join(', ') || 'Ø'
    };
}

export function permutations(n, r) {
    if (r > n) return 0;
    return factorial(n) / factorial(n - r);
}

export function combinations(n, r) {
    if (r > n) return 0;
    return factorial(n) / (factorial(r) * factorial(n - r));
}

function factorial(num) {
    if (num < 0) return 0;
    if (num <= 1) return 1;
    let res = 1;
    for (let i = 2; i <= num; i++) res *= i;
    return res;
}

export function multiplicativeRule(pA, pBgivenA) {
    const pAnB = pA * pBgivenA;
    const pA_comp = (1 - pA).toFixed(2);
    const pBgivenA_comp = (1 - pBgivenA).toFixed(2);

    return {
        result: pAnB.toFixed(4),
        pA,
        pBgivenA,
        pA_comp,
        pBgivenA_comp,
        pAnB: pAnB.toFixed(4),
        pAnBcomp: (pA * (1 - pBgivenA)).toFixed(4)
    };
}

export function generateTreeHTML(results) {
    const { pA, pBgivenA, pA_comp, pBgivenA_comp, pAnB, pAnBcomp } = results;
    
    return `
        <div class="v-tree">
            <ul>
                <li>
                    <div class="v-node v-node-root">Ω</div>
                    <ul>
                        <li>
                            <div class="v-node v-node-event">P(A) = ${pA}</div>
                            <ul>
                                <li>
                                    <div class="v-node v-node-result">
                                        <span class="label">P(B|A) = ${pBgivenA}</span>
                                        <hr>
                                        <strong>P(A ∩ B) = ${pAnB}</strong>
                                    </div>
                                </li>
                                <li>
                                    <div class="v-node v-node-result alt">
                                        <span class="label">P(B'|A) = ${pBgivenA_comp}</span>
                                        <hr>
                                        <strong>P(A ∩ B') = ${pAnBcomp}</strong>
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <div class="v-node v-node-event alt">P(A') = ${pA_comp}</div>
                            <ul>
                                <li>
                                    <div class="v-node v-node-placeholder">
                                        No especificado
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    `;
}