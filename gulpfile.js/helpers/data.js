/*
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

/* eslint-disable no-magic-numbers, max-len */

const partitionsOfTwelve = [[12], [11,1], [10,2], [10,1,1], [9,3], [9,2,1], [9,1,1,1], [8,4], [8,3,1], [8,2,2], [8,2,1,1], [8,1,1,1,1], [7,5], [7,4,1], [7,3,2], [7,3,1,1], [7,2,2,1], [7,2,1,1,1], [7,1,1,1,1,1], [6,6], [6,5,1], [6,4,2], [6,4,1,1], [6,3,3], [6,3,2,1], [6,3,1,1,1], [6,2,2,2], [6,2,2,1,1], [6,2,1,1,1,1], [6,1,1,1,1,1,1], [5,5,2], [5,5,1,1], [5,4,3], [5,4,2,1], [5,4,1,1,1], [5,3,3,1], [5,3,2,2], [5,3,2,1,1], [5,3,1,1,1,1], [5,2,2,2,1], [5,2,2,1,1,1], [5,2,1,1,1,1,1], [5,1,1,1,1,1,1,1], [4,4,4], [4,4,3,1], [4,4,2,2], [4,4,2,1,1], [4,4,1,1,1,1], [4,3,3,2], [4,3,3,1,1], [4,3,2,2,1], [4,3,2,1,1,1], [4,3,1,1,1,1,1], [4,2,2,2,2], [4,2,2,2,1,1], [4,2,2,1,1,1,1], [4,2,1,1,1,1,1,1], [4,1,1,1,1,1,1,1,1], [3,3,3,3], [3,3,3,2,1], [3,3,3,1,1,1], [3,3,2,2,2], [3,3,2,2,1,1], [3,3,2,1,1,1,1], [3,3,1,1,1,1,1,1], [3,2,2,2,2,1], [3,2,2,2,1,1,1], [3,2,2,1,1,1,1,1], [3,2,1,1,1,1,1,1,1], [3,1,1,1,1,1,1,1,1,1], [2,2,2,2,2,2], [2,2,2,2,2,1,1], [2,2,2,2,1,1,1,1], [2,2,2,1,1,1,1,1,1], [2,2,1,1,1,1,1,1,1,1], [2,1,1,1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1,1,1,1,1]];

/*
   Go to https://www.w3.org/TR/CSS/#properties
   Paste in console:

   var properties = document.querySelector('#properties');
   var index = properties.nextElementSibling.querySelector('ul.index');
   index.querySelectorAll('ul').forEach((x) => x.remove());
   var cssProperties = Array.from(index.querySelectorAll('li')).map((x) => x.innerText);
   cssProperties = cssProperties.filter((x) => ! /[*']/.test(x));
   cssProperties.push('aspect-ratio'); // aspect-ratio is not (yet) included in index
   console.log(JSON.stringify(cssProperties.sort()).replaceAll('"', "'"));
 */
const cssProperties = ['align-content','align-items','align-self','all','animation','animation-delay','animation-direction','animation-duration','animation-fill-mode','animation-iteration-count','animation-name','animation-play-state','animation-timing-function','aspect-ratio','background','background-attachment','background-blend-mode','background-clip','background-color','background-image','background-origin','background-position','background-repeat','background-size','border','border-bottom','border-bottom-color','border-bottom-left-radius','border-bottom-right-radius','border-bottom-style','border-bottom-width','border-color','border-image','border-image-outset','border-image-repeat','border-image-slice','border-image-source','border-image-width','border-left','border-left-color','border-left-style','border-left-width','border-radius','border-right','border-right-color','border-right-style','border-right-width','border-style','border-top','border-top-color','border-top-left-radius','border-top-right-radius','border-top-style','border-top-width','border-width','box-decoration-break','box-shadow','box-sizing','break-after','break-before','break-inside','caret-color','clip','clip-path','clip-rule','color-interpolation-filters','column-count','column-fill','column-gap','column-rule','column-rule-color','column-rule-style','column-rule-width','column-span','column-width','columns','contain','cue','cue-after','cue-before','cursor','direction','display','filter','flex','flex-basis','flex-direction','flex-flow','flex-grow','flex-shrink','flex-wrap','flood-color','flood-opacity','gap','glyph-orientation-vertical','grid','grid-area','grid-auto-columns','grid-auto-flow','grid-auto-rows','grid-column','grid-column-end','grid-column-gap','grid-column-start','grid-gap','grid-row','grid-row-end','grid-row-gap','grid-row-start','grid-template','grid-template-areas','grid-template-columns','grid-template-rows','hanging-punctuation','hyphens','image-orientation','image-rendering','isolation','justify-content','justify-items','justify-self','letter-spacing','lighting-color','line-break','mask','mask-border','mask-border-mode','mask-border-outset','mask-border-repeat','mask-border-slice','mask-border-source','mask-border-width','mask-clip','mask-composite','mask-image','mask-mode','mask-origin','mask-position','mask-repeat','mask-size','mask-type','mix-blend-mode','object-fit','object-position','order','orphans','outline','outline-color','outline-offset','outline-style','outline-width','overflow-wrap','pause','pause-after','pause-before','place-content','place-items','place-self','resize','rest','rest-after','rest-before','row-gap','scroll-margin','scroll-margin-block','scroll-margin-block-end','scroll-margin-block-start','scroll-margin-bottom','scroll-margin-inline','scroll-margin-inline-end','scroll-margin-inline-start','scroll-margin-left','scroll-margin-right','scroll-margin-top','scroll-padding','scroll-padding-block','scroll-padding-block-end','scroll-padding-block-start','scroll-padding-bottom','scroll-padding-inline','scroll-padding-inline-end','scroll-padding-inline-start','scroll-padding-left','scroll-padding-right','scroll-padding-top','scroll-snap-align','scroll-snap-stop','scroll-snap-type','shape-image-threshold','shape-margin','shape-outside','speak','speak-as','tab-size','text-align','text-align-all','text-align-last','text-combine-upright','text-decoration','text-decoration-color','text-decoration-line','text-decoration-style','text-emphasis','text-emphasis-color','text-emphasis-position','text-emphasis-style','text-indent','text-justify','text-orientation','text-overflow','text-shadow','text-transform','text-underline-position','transform','transform-box','transform-origin','transition','transition-delay','transition-duration','transition-property','transition-timing-function','unicode-bidi','visibility','voice-balance','voice-duration','voice-family','voice-pitch','voice-range','voice-rate','voice-stress','voice-volume','white-space','widows','will-change','word-break','word-spacing','word-wrap','writing-mode'];

module.exports = {
    partitionsOfTwelve,
    cssProperties
};
