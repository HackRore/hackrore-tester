"use client"
import { useState, useCallback } from 'react';
import ReactFlow, {
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Node,
    Edge,
    Connection,
    NodeChange,
    EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card } from "@/components/ui/card"

const initialNodes: Node[] = [
    {
        id: '1',
        data: { label: 'Power Source (Battery)' },
        position: { x: 250, y: 0 },
        type: 'input',
    },
    {
        id: '2',
        data: { label: 'Motherboard' },
        position: { x: 250, y: 100 },
    },
    {
        id: '3',
        data: { label: 'Screen' },
        position: { x: 100, y: 200 },
    },
    {
        id: '4',
        data: { label: 'Charging Port' },
        position: { x: 400, y: 200 },
    }
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e2-4', source: '2', target: '4' },
];

export function WiringBuilder() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [],
    );

    return (
        <Card className="h-[600px] w-full border rounded-md overflow-hidden relative">
            <div className="absolute top-2 left-2 z-10 bg-background/80 p-2 rounded text-xs pointer-events-none">
                Drag nodes to rearrange. Drag from handles to connect.
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background />
                <Controls />
            </ReactFlow>
        </Card>
    );
}
