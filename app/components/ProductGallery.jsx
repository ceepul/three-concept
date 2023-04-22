import {ATTR_LOADING_EAGER} from '~/lib/const';
import { MediaFile } from '@shopify/hydrogen-react';
import { useState, useEffect } from 'react';
import { ModelCard, textureExists } from './ModelCard';

const avatarMap = new Map([
  ['logo-t-shirt', '/models/model.gltf'],
  ['loose-fit-o-neck-t-shirt', '/models/model.gltf'],
  ['standard-fit-o-neck-t-shirt', '/models/model.gltf'],
  ['pull-bear-crop-top-with-tie-up-neckline', '/models/crop-top-animated.glb'],
  ['pull-bear-short-striped-crochet-dress', '/models/dress-animated.glb'],
]);

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({media, selectedVariant, className}) {
  const [selectedColor, setSelectedColor] = useState("")
  const textureId = selectedVariant.product.handle + '/' + selectedVariant.selectedOptions.find(option => option.name ==='Color').value
  const avatarId = avatarMap.get(selectedVariant.product.handle)

  const mediaIndex = 1 // Determines what index in the media the 3d model viewer will be displayed at

  useEffect(() => {
    selectedVariant.selectedOptions.forEach(option => {
      if (option.name === 'Color') 
        setSelectedColor(option.value)
        return
    });
  }, [selectedVariant])

  if (!media.length) {
    return null;
  }

  const mediaObjects = media.map((med, i, x = 0) => {

    if (med.alt != selectedColor && med.alt != "" && selectedColor != "") {
      x += 1 // add one to the number of images not diplayed
      return null
    }  //Dont display media if the alt text does not match the current color

      let mediaProps = {};
      const isFirst = i - x === 0; // i - x --> image number - num img not displayed = img number in set
      const isFourth = i - x === 3;
      const isFullWidth = i - x % 3 === 0;

      const data = {
        ...med,
        image: {
          ...med.image,
          altText: med.alt || 'Product image',
        },
      };

      switch (med.mediaContentType) {
        case 'IMAGE':
          mediaProps = {
            width: 800,
            widths: [400, 800, 1200, 1600, 2000, 2400],
          };
          break;
        case 'VIDEO':
          mediaProps = {
            width: '100%',
            autoPlay: true,
            controls: false,
            muted: true,
            loop: true,
            preload: 'auto',
          };
          break;
        case 'EXTERNAL_VIDEO':
          mediaProps = {width: '100%'};
          break;
        case 'MODEL_3D':
          mediaProps = {
            exposure: '0.95',
            interactionPromptThreshold: '1',
            ar: true,
            loading: 'eager',
            //cameraControls: true,
            //touchAction: 'pan-y',
            disableZoom: true,
            style: {height: '100%', width: '100%', margin: '0 auto'},
          };
          break;
      }

      if (i === 0 && med.mediaContentType === 'IMAGE') {
        mediaProps.loading = ATTR_LOADING_EAGER;
      }

      const style = [
        isFullWidth ? 'md:col-span-2' : 'md:col-span-1',
        isFirst || isFourth ? '' : 'md:aspect-[4/5]',
        'aspect-square snap-center card-image bg-white dark:bg-contrast/10 w-mobileGallery md:w-full',
      ].join(' ');

      return (
        <div
          className={style}
          // @ts-ignore
          key={med.id || med.image.id}
        >
          <MediaFile
                tabIndex="0"
                className={`w-full h-full aspect-square fadeIn object-cover`}
                data={data}
                sizes={
                  isFullWidth
                    ? '(min-width: 64em) 60vw, (min-width: 48em) 50vw, 90vw'
                    : '(min-width: 64em) 30vw, (min-width: 48em) 25vw, 90vw'
                }
                options={{
                  crop: 'center',
                  scale: 2,
                }}
                {...mediaProps}
              />
        </div>
      );
    })

  const augmentedMediaObjects = []
  
  mediaObjects.map((obj) => { // creates an array of just the media objects that will be displayed
    if (obj !== null) augmentedMediaObjects.push(obj) 
  })

  console.log(textureId)
  
  if (textureExists(textureId)) {
    augmentedMediaObjects.splice(mediaIndex, 0, ( // adds the 3d model viewer at the index specified by mediaIndex
      <div className='md:col-span-1 md:aspect-[4/5] aspect-square snap-center bg-white dark:bg-contrast/10 w-mobileGallery md:w-full' key='placeHolderKey'>
        <ModelCard textureId={textureId} avatarId={avatarId}/>
      </div>
    ))
  }

  else if (avatarId !== '/models/model.gltf' && avatarId) {
    augmentedMediaObjects.splice(mediaIndex, 0, ( // adds the 3d model viewer at the index specified by mediaIndex
      <div className='md:col-span-1 md:aspect-[4/5] aspect-square snap-center bg-white dark:bg-contrast/10 w-mobileGallery md:w-full' key='placeHolderKey'>
        <ModelCard textureId={null} avatarId={avatarId}/>
      </div>
    ))
  }
  
  return (
    <div
      className={`swimlane md:grid-flow-row hiddenScroll md:p-0 md:overflow-x-auto md:grid-cols-2 ${className}`}
    >
      {augmentedMediaObjects}
    </div>
  );
}
