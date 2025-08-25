import { useVueFlow } from "@vue-flow/core";
import dagre from '@dagrejs/dagre'
import { ref, computed } from 'vue'

export function getSourceHandleId(nodeId, sourceHandleType) {
    return `${nodeId}_${sourceHandleType}`
}

export let useOperation = () => {
    const {
        addNodes,
        addEdges,
        removeEdges,
        updateNodeInternals,
        onNodesInitialized,
        findNode,
        edges,
        nodes
    } = useVueFlow()
    let { layout } = uselayout()
    let createNode = (type) => {
        const nodeId = parseInt(Math.random() * 1000) + ''
        const position = {
            x: 0,
            y: 0,
        }
        return {
            id: nodeId,
            type,
            position,
            targetPosition: "left",
            sourcePosition: "right",
            data: {
                id: nodeId,
                type,
                bizData: { nodeId, type, position }
            },
        }
    }
    let createEdge = (sourceId, targetId, sourceHandleType = 'source', targetHandleType = 'target') => {
        const edgeId = parseInt(Math.random() * 1000) + ''
        return {
            id: edgeId,
            type: 'button',
            source: sourceId,
            sourceHandle: getSourceHandleId(sourceId, sourceHandleType),
            target: targetId,
            targetHandle: getSourceHandleId(
                targetId,
                targetHandleType,
            ),
        }
    }

    function collectDescendantNodes(id) {
        const rootNode = findNode(id)

        if (!rootNode) {
            return []
        }

        const descendants = []

        let bfsList = [rootNode]

        while (bfsList.length) {
            const nextBfsList = []

            bfsList.forEach((t) => {
                const sourceEdges = edges.value.filter((e) => e.source === t.id)

                const targets = [...new Set(sourceEdges.map((e) => e.target).map((tId) => findNode(tId)).filter(Boolean))]

                nextBfsList.push(...targets)
            })

            descendants.push(...nextBfsList)

            bfsList = nextBfsList
        }

        return descendants
    }

    function moveNode(nodeId, moveOffsetX, moveOffsetY, withChildren = true) {
        const targetNode = findNode(nodeId)

        const movingNodes = [targetNode]

        if (withChildren) {
            movingNodes.push(...collectDescendantNodes(targetNode.id))
        }

        movingNodes.forEach((t) => {
            t.position.x += moveOffsetX
            t.position.y += moveOffsetY
            t.data.bizData.position.x = t.position.x
            t.data.bizData.position.y = t.position.y
        })
    }


    function insertNodeAt(newId, targetId) {
        const newNode = findNode(newId)
        const targetNode = findNode(targetId)

        // const {dimensionsOffset, positionOffset} = getNodeLayoutOffset(newNode.type)

        // if (!targetNode) {
        //     newNode.position = project({
        //         x: 230 + positionOffset.x,
        //         y: 30 + positionOffset.y,
        //     })
        //     newNode.data.bizData.position = newNode.position
        // } else {
        // const {dimensionsOffset: _targetDimensionsOffset, positionOffset: targetPositionOffset} =
        //     getNodeLayoutOffset(targetNode.type)

        // 插入的节点放置在右侧节点位置
        newNode.position = {
            x: targetNode.position.x,
            y: targetNode.position.y
        }
        newNode.data.bizData.position = newNode.position

        const moveOffsetX = newNode.dimensions.width + 120
        moveNode(targetNode.id, moveOffsetX, 0)
        // }
    }

    let handleClick = (type, sourceId, targetId, sourceHandleType = 'source', targetHandleType = 'target') => {
        let parentNodeId;
        let newNode = createNode(type);

        let t = (sourceId && findNode(sourceId))
        parentNodeId = t?.parentNode
        // parentNodeId.par
        // 处理嵌套节点
        if (parentNodeId) {
            newNode.parentNode = parentNodeId
            newNode.expandParent = true
            newNode.data.bizData.parentNode = parentNodeId
        }
        let appendNodes = [newNode]
        // data.value.nodes.push(newNode)

        if (['loop'].includes(type)) {
            let nestedStartNode = createNode('nestedStart');
            newNode.data.bizData.nestedStartNode = nestedStartNode.id
            nestedStartNode.parentNode = newNode.id
            nestedStartNode.expandParent = true
            nestedStartNode.data.bizData.parentNode = newNode.id
            nestedStartNode.position = {
                x: 20,
                y: 55,
            }
            appendNodes.push(nestedStartNode)
        }
        let appendEdges = []
        if (sourceId) {
            appendEdges.push(createEdge(sourceId, newNode.id, sourceHandleType, targetHandleType))
        }
        if (targetId && type !== 'condition') {
            appendEdges.push(createEdge(newNode.id, targetId, sourceHandleType, targetHandleType))
        }
        addNodes(appendNodes)
        addEdges(appendEdges)
        const { off } = onNodesInitialized(() => {
            if (sourceId) {
                const createFromNode = findNode(sourceId)

                if (createFromNode.type === "nestedStart") {
                    const newPosition = {
                        x: createFromNode.position.x + 28 + 60,
                        y: createFromNode.position.y - 18
                    }
                    const addedNode = findNode(newNode.id)
                    addedNode.position = newPosition
                    addedNode.data.bizData.position = newPosition
                } else {
                    // 除了来自的创造节点以外他的所有target节点都要输入
                    const addedNode = findNode(newNode.id)
                    const layoutNodes = [createFromNode]
                    // 找到 createFromNode 的所有 target 节点
                    const targetEdges = edges.value.filter(edge => edge.source === createFromNode.id)
                    const targetNodes = targetEdges.map(edge => findNode(edge.target)).filter(Boolean)
                    // 将 createFromNode 和它的所有 target 节点都添加到 layoutNodes
                    layoutNodes.push(...targetNodes)
                    // layoutNodes.push(addedNode)
                    
                    const layoutEdges = []
                    // 将 createFromNode 与其所有 target 节点之间已有的连线加入 layoutEdges
                    layoutEdges.push(...targetEdges)
                    const createFromNodeOrigin = {
                        ...createFromNode.position
                    }
                    const updatedNodes = layout(layoutNodes, layoutEdges)
                    const createFromNodeNewOrigin = updatedNodes.find(
                        (t) => t.id === createFromNode.id
                    )?.position
                    const addedNodePosition = updatedNodes.find((t) => t.id === newNode.id)?.position
                    addedNodePosition.x =
                        addedNodePosition.x - (createFromNodeNewOrigin.x - createFromNodeOrigin.x)
                    addedNodePosition.y =
                        addedNodePosition.y - (createFromNodeNewOrigin.y - createFromNodeOrigin.y)
                    addedNode.position = addedNodePosition
                    addedNode.data.bizData.position = addedNodePosition
                }

            }
            if (targetId) {
                insertNodeAt(newNode.id, targetId)
            }
            off()
        })
    }

    return { handleClick, collectDescendantNodes, createNode, createEdge, insertNodeAt }
}

export let uselayout = () => {
    let { findNode } = useVueFlow()


    let layout = (nodes, edges) => {
        const graph = ref(new dagre.graphlib.Graph())
        // we create a new graph instance, in case some nodes/edges were removed, otherwise dagre would act as if they were still there
        const dagreGraph = new dagre.graphlib.Graph()

        graph.value = dagreGraph

        dagreGraph.setDefaultEdgeLabel(() => ({}))

        dagreGraph.setGraph({
            rankdir: 'LR',
            align: 'UL',
            ranksep: 120,
            nodesep: 60,
        })

        for (const node of nodes) {
            const graphNode = findNode(node.id)

            // const {dimensionsOffset, positionOffset} = getNodeLayoutOffset(graphNode.type)

            dagreGraph.setNode(node.id, {
                width: graphNode.dimensions.width,
                height: graphNode.dimensions.height
            })
        }

        for (const edge of edges) {
            dagreGraph.setEdge(edge.source, edge.target)
        }

        dagre.layout(dagreGraph, {
            disableOptimalOrderHeuristic: true,
        })

        let minX = null
        let minY = null

        // set nodes with updated positions
        const next = nodes.map((node) => {
            // layoutReadyNode.x 是节点的中心坐标
            // layoutReadyNode.y 是节点的上边距坐标
            const layoutReadyNode = dagreGraph.node(node.id)

            const nextX =
                layoutReadyNode.x - layoutReadyNode.width / 2 + (layoutReadyNode.positionOffset?.x || 0)
            const nextY = layoutReadyNode.y + (layoutReadyNode.positionOffset?.y || 0)

            if (typeof minX !== 'number') {
                minX = nextX
            } else {
                minX = Math.min(minX, nextX)
            }

            if (typeof minY !== 'number') {
                minY = nextY
            } else {
                minY = Math.min(minY, nextY)
            }

            return {
                ...node,
                position: {
                    x: nextX,
                    y: nextY,
                },
            }
        })

        const customOffsetX = 48 - minX
        const customOffsetY = 48 - minY

        next.forEach((t) => {
            t.position.x += customOffsetX
            t.position.y += customOffsetY
        })

        return next
    }
    return { layout }
}

export let useMenu = (nodeId) => {
    const { findNode } = useVueFlow()
    let calcDisabledNodeTypes = computed(() => {
        let disableNodeTypes = []
        let currentNode = findNode(nodeId)
        let parentNode = findNode(currentNode?.parentNode)
        if (parentNode?.type == "loop") {
            disableNodeTypes.push("loop")
            return disableNodeTypes
        }
    })

    return { calcDisabledNodeTypes }
}