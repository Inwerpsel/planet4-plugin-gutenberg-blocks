import { Socialshare } from './Socialshare';

export class SocialshareBlock {
    constructor() {
      const {registerBlockType} = wp.blocks;
      const {__} = wp.i18n;
      const { withSelect } = wp.data;

      registerBlockType( 'planet4-blocks/socialshare', {
        title: __('Socialshare', 'p4ge'),
        icon: 'format-image',
        category: 'planet4-blocks',

        /**
         * Transforms old 'shortcake' shortcode to new gutenberg block.
         *
         * old block-shortcode:
         * [shortcake_happy_point background="4968" focus_image="center center" opacity="60" mailing_list_iframe="true" iframe_url="https%3A%2F%2Fact.greenpeace.org%2Fpage%2F34215%2Fsubscribe%2F1" /]
         *
         * new block-gutenberg:
         * <!-- wp:planet4-blocks/socialshare {"focus_image":"50% 50%","opacity":60,"mailing_list_iframe":true,"iframe_url":"https://act.greenpeace.org/page/34215/subscribe/1","id":4968} /-->
         */
        transforms: {
          from: [
            {
              type: 'shortcode',
              // Shortcode tag can also be an array of shortcode aliases
              tag: 'shortcake_socail_share',
              attributes: {
                title: {
                  type: 'string',
                  shortcode: function (attributes) {
                    return attributes.named.title;
                  }
                },
                opacity: {
                  type: 'integer',
                  shortcode: ({named: {opacity = ''}}) => opacity,
                },
                id: {
                  type: 'integer',
                  shortcode: ({named: {id = ''}}) => id,
                },
                focus_image: {
                  type: 'string',
                  shortcode: ({named: {focus_image = ''}}) => focus_image,
                },
              },
            },
          ]
        },
        attributes: {
          title: {
            type: 'string',
            default: '',
          },
          focus_image: {
            type: 'string',
          },
          opacity: {
            type: 'number',
            default: 60
          },
          id: {
            type: 'number',
          }
        },
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

          function onTitleChange(value) {
            setAttributes({title: value});
          }

          function onOpacityChange( value ) {
            setAttributes({opacity: value});
          }

          function onMailingListIframeChange( value ) {
            setAttributes({mailing_list_iframe: value});
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

          return <Socialshare
            {...attributes}
            isSelected={isSelected}
            url={img_url}
            onTitleChange={onTitleChange}
            onSelectImage={onSelectImage}
            onOpacityChange={onOpacityChange}
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

