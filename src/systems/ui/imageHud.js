/** Test-only floating image HUD. It is intentionally isolated from generation. */
import { extensionSettings } from '../../core/state.js';

const HUD_ID = 'rpg-test-image-hud';

function getConfig() {
    return extensionSettings.testImageHud || {};
}

function clampSize(value) {
    return Math.min(5, Math.max(1, Number(value) || 1));
}

function getWidth(size) {
    return 180 + (size - 1) * 60;
}

export function removeTestImageHud() {
    $('#' + HUD_ID).remove();
}

export function renderTestImageHud() {
    removeTestImageHud();
    const config = getConfig();
    if (!config.enabled || !String(config.url || '').trim()) return;

    const size = clampSize(config.size);
    const width = getWidth(size);
    const theme = extensionSettings.theme || 'default';
    const url = String(config.url).trim().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const $hud = $(`
        <section id="${HUD_ID}" class="rpg-test-image-hud" data-theme="${theme}" aria-label="Test Image HUD">
            <header class="rpg-test-image-hud-header">
                <span class="rpg-test-image-hud-title"><i class="fa-solid fa-image"></i> Test Image</span>
                <button type="button" class="rpg-test-image-hud-close" title="Close test image">×</button>
            </header>
            <div class="rpg-test-image-hud-body">
                <img class="rpg-test-image-hud-image" src="${url}" alt="Test image">
            </div>
        </section>
    `);

    $hud.css('--rpg-test-image-width', width + 'px');
    if (theme === 'custom') {
        $hud.css({ '--rpg-bg': extensionSettings.customColors.bg, '--rpg-accent': extensionSettings.customColors.accent, '--rpg-text': extensionSettings.customColors.text, '--rpg-highlight': extensionSettings.customColors.highlight });
    }
    $('body').append($hud);
    $hud.on('click', '.rpg-test-image-hud-close', () => $hud.remove());

    const positionHud = () => {
        const margin = 20;
        const topBar = $('#top-settings-holder');
        const top = (topBar.outerHeight() || 140) + 10;
        const onLeft = extensionSettings.panelPosition === 'left';
        $hud.css({ top: top + 'px', left: onLeft ? 'auto' : margin + 'px', right: onLeft ? margin + 'px' : 'auto' });
    };

    positionHud();
    $(window).off('resize.rpgTestImageHud').on('resize.rpgTestImageHud', positionHud);
}

export function initTestImageHud() {
    renderTestImageHud();
}
