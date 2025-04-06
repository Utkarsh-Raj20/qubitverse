import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network/standalone";

function HilbertSpaceResult({ nodes, edges, measuredValue }) {
    const containerRef = useRef(null);
    const networkRef = useRef(null);
    // Create a ref to store the nodes dataset
    const nodesRef = useRef(nodes);

    useEffect(() => {
        nodesRef.current = nodes;
    }, [nodes]);

    useEffect(() => {
        if (containerRef.current && !networkRef.current) {
            const options = {
                nodes: {
                    shape: "box",
                    margin: 10,
                    font: { face: "monospace", size: 14 },
                    widthConstraint: { maximum: 1000 },
                },
                edges: {
                    arrows: "to",
                    smooth: false,
                },
                interaction: {
                    dragNodes: true,
                    zoomView: true,
                    dragView: true,
                },
                physics: {
                    enabled: false,
                },
                layout: {
                    randomSeed: 1,
                    improvedLayout: true,
                    hierarchical: {
                        enabled: false,
                        direction: "UD",
                        sortMethod: "directed",
                    },

                },
            };

            networkRef.current = new Network(containerRef.current, { nodes, edges }, options);

            // When a node is clicked, toggle its expanded state.
            networkRef.current.on("click", (params) => {
                if (params.nodes.length > 0) {
                    const nodeId = params.nodes[0];
                    const node = nodesRef.current.get(nodeId);
                    if (node) {
                        if (!node.expanded) {
                            const tableText = node.values
                                .map((row) => `${row.qubit}: ${row.value}`)
                                .join("\n");
                            nodesRef.current.update({ id: nodeId, label: tableText, expanded: true });
                        } else {
                            nodesRef.current.update({
                                id: nodeId,
                                label: node.originalLabel,
                                expanded: false,
                            });
                        }
                    }
                }
            });
        }
    }, [nodes, edges]);

    useEffect(() => {
        if (networkRef.current) {
            networkRef.current.setData({ nodes, edges });
        }
    }, [nodes, edges]);

    return (
        <div>
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "calc(100vh - 225px)",
                    border: "solid 2px",
                    borderRadius: "5px",
                    backgroundColor: "#f8f8f8",
                    backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
                    backgroundSize: "25px 25px",
                }}
            ></div>
            <h1
                className="text-xl font-bold text-gray-800"
                style={{ userSelect: "none", color: "#36802D", paddingTop: "15px" }}
            >
                Measurement: {measuredValue}
            </h1>
        </div>
    );
}

export default HilbertSpaceResult;
