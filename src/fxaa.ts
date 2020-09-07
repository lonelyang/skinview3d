import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { SkinViewer, SkinViewerOptions } from "./viewer.js";

export class FXAASkinViewer extends SkinViewer {

    readonly composer: EffectComposer;
    readonly renderPass: RenderPass;
    readonly fxaaPass: ShaderPass;

    constructor(options: SkinViewerOptions = {}) {
        super(options);
        this.composer = new EffectComposer(this.renderer);
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.fxaaPass = new ShaderPass(FXAAShader);
        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.fxaaPass);
        this.updateComposerSize();
    }

    setSize(width: number, height: number): void {
        super.setSize(width, height);
        if (this.composer !== undefined) {
            this.updateComposerSize();
        }
    }

    private updateComposerSize(): void {
        this.composer.setSize(this.width, this.height);
        const pixelRatio = this.renderer.getPixelRatio();
        this.composer.setPixelRatio(pixelRatio);
        this.fxaaPass.material.uniforms["resolution"].value.x = 1 / (this.width * pixelRatio);
        this.fxaaPass.material.uniforms["resolution"].value.y = 1 / (this.height * pixelRatio);
    }

    protected doRender(): void {
        this.composer.render();
    }
}
