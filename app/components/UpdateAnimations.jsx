import { useAnimations } from "@react-three/drei";

export default function UpdateAnimations({ animations, group }) {
    const actions = useAnimations(animations, group)

    return (
        { actions }
    )
}