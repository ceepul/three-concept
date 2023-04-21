import { Canvas } from 'react-three-fiber';
import { Suspense, useState, useEffect } from 'react';
import { Environment, OrbitControls } from '@react-three/drei';
import MensModel from './MensModel'
import DressModel from './DressModel'
import CropTopModel from './CropTopModel'
import '../../styles/app.css'
import { Bars } from 'react-loading-icons'

const texturesMap = new Map([
    ['logo-t-shirt/WHITE / WHITE', '/models/textures/jackjones-logot-shirt-texture-map.png'],
    ['logo-t-shirt/BLUE / NAVY BLAZER', '/models/textures/jackjones-logot-shirt-blue-texture-map.png'],
    ['logo-t-shirt/BLACK / BLACK', '/models/textures/jackjones-logot-shirt-black-texture-map.png'],
    ['loose-fit-o-neck-t-shirt/BLACK / BLACK', '/models/textures/jackjones-loose-fit-o-neck-black-texture-map.png'],
    ['standard-fit-o-neck-t-shirt/BEIGE / MOONBEAM', '/models/textures/jackjones-standard-fit-o-neck-beige-texture-map.png'],
  ]);

export function ModelCard({textureId, avatarId}) {
    const [currentAvatar, setCurrentAvatar] = useState('/models/model.gltf')
    const [currentTexture, setCurrentTexture] = useState(texturesMap.get(textureId)? texturesMap.get(textureId) : null)

    /* const handleAvatarChange = (event) => {
        event.preventDefault()
        currentAvatar === '/models/model.gltf' ? 
            setCurrentAvatar('https://models.readyplayer.me/63d1a31c6a3f508dbc968189.glb') : 
            setCurrentAvatar('/models/model.gltf')
    }
 */

    useEffect(() => {
        setCurrentTexture(texturesMap.get(textureId)? texturesMap.get(textureId) : null)
        setCurrentAvatar(avatarId)
    }, [textureId, avatarId]);

    const modelObject = (() => {
        if (currentAvatar === '/models/model.gltf') {
            return (
                <MensModel
                    scale={[1, 1, 1]}
                    currentTexture={currentTexture}
                    currentAvatar={currentAvatar}
                    position={[0, 0.18, 0]}
                />
            )
        }
        else if (currentAvatar === '/models/dress-animated.glb') {
            return (
                <DressModel
                    scale={[1, 1, 1]}
                    currentTexture={currentTexture}
                    currentAvatar={currentAvatar}
                    position={[0, 0.18, 0]}
                />
            )
        }
        else if (currentAvatar === '/models/crop-top-animated.glb') {
            return (
                <CropTopModel
                    scale={[1, 1, 1]}
                    currentTexture={currentTexture}
                    currentAvatar={currentAvatar}
                    position={[0, 0.18, 0]}
                />
            )
        }
    })

    return (
        <div className="model-container">
            <p className='model-title'>TRY IN 3D</p>
            <Suspense fallback={
                <div className='model-loading'>
                <Bars height={'5rem'}/>
                <h3 className='loading-text'>Loading...</h3>
            </div>
            }>
                <Canvas
                    style={{ background: 'transparent'}}
                    camera={{ 
                        position: [0, 1.8, 2.1],
                        fov: 45
                    }}
                >
                    <ambientLight intensity={0.35} />
                    <Environment preset='sunset'/>
                    <OrbitControls 
                        //autoRotate
                        target={[0, 1.3, 0]}
                        enablePan = {false}
                        minDistance={0.8}
                        maxDistance={3}
                    />
                    {modelObject()}
                </Canvas>
            </Suspense>
            <div className='model-swipebar-bottom'></div>
            <div className='model-swipebar-top'></div>
            {/*<button onClick={(event) => handleAvatarChange(event)}>Change Outfit</button>*/}
        </div>
    )
}

export function textureExists(textureId) {
    return (texturesMap.get(textureId) ? true : false)
  }