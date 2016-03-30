import InlineLoader from '../../vddf/loaders/inline';

/**
 * Load vDDF from embed script tag
 */
export default class EmbedScriptLoader extends InlineLoader {
  isSupported(source) {
    return typeof source === 'string' && /^inline:\/\//.test(source);
  }

  async load(source, manager) {
    const inlineId = 'inline-' + source.split('//').pop();
    const el = document.getElementById(inlineId);

    if (!el) {
      throw new Error(`Inline vDDF is not available: ${inlineId}`);
    }

    return await super.load(JSON.parse(el.innerHTML), manager);
  }
}
