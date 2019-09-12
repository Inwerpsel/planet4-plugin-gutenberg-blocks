import {Happypoint} from './Happypoint';
import happypointConfig from './HappypointConfig';

export class HappypointBlock {
    constructor() {
      const {registerBlockType} = wp.blocks;
      const {__} = wp.i18n;
      const { withSelect } = wp.data;

      registerBlockType( happypointConfig.gutenbergTag, {
        title: __('Happypoint', 'p4ge'),
        icon: 'format-image',
        category: 'planet4-blocks',

        /**
         * Transforms old 'shortcake' shortcode to new gutenberg block.
         *
         * old block-shortcode:
         * [shortcake_happy_point background="4968" focus_image="center center" opacity="60" mailing_list_iframe="true" iframe_url="https%3A%2F%2Fact.greenpeace.org%2Fpage%2F34215%2Fsubscribe%2F1" /]
         *
         * new block-gutenberg:
         * <!-- wp:planet4-blocks/happypoint {"focus_image":"50% 50%","opacity":60,"mailing_list_iframe":true,"iframe_url":"https://act.greenpeace.org/page/34215/subscribe/1","id":4968} /-->
         */
        transforms: {
          from: [
            {
              type: 'shortcode',
              // Shortcode tag can also be an array of shortcode aliases
              tag: happypointConfig.shortCodeTag,
              attributes: happypointConfig.shortCodeAttributes,
            },
          ]
        },
        attributes: happypointConfig.gutenbergAttributes,
        edit: withSelect( ( select, props ) => {
          const { attributes } = props;
          const { id } = attributes;
          let img_url = '';

          if (id && (0 < id)) {
            img_url = select('core').getMedia(id);
            if(img_url){
              img_url = img_url.media_details.sizes.medium.source_url;
            }
          }

          return {
            img_url
          };
        } )( ( {
          img_url,
          isSelected,
          attributes,
          setAttributes
        } ) => {
          function onBackgroundChange( value ) {
            setAttributes({background: value});
          }

          function onOpacityChange( value ) {
            setAttributes({opacity: value});
          }

          function onMailingListIframeChange( value ) {
            setAttributes({mailing_list_iframe: value});
          }

          function onIframeUrlChange( value ) {
            setAttributes({iframe_url: value});
          }

          function onFocalPointChange( {x,y} ) {
            x = parseFloat(x).toFixed(2);
            y = parseFloat(y).toFixed(2);
            setAttributes({focus_image: (x*100)+'% '+(y*100)+'%'});
          }

          function onSelectImage({id}) {
            setAttributes({id});
          }

          function onRemoveImages() {
            setAttributes({id: -1});
            setAttributes({focus_image: ''});
          }

          return <Happypoint
            {...attributes}
            isSelected={isSelected}
            url={img_url}
            onSelectImage={onSelectImage}
            onOpacityChange={onOpacityChange}
            onMailingListIframeChange={onMailingListIframeChange}
            onIframeUrlChange={onIframeUrlChange}
            onFocalPointChange={onFocalPointChange}
            onRemoveImages={onRemoveImages}
          />
        }),
        save() {
          return null;
        }
      });
    };
}

