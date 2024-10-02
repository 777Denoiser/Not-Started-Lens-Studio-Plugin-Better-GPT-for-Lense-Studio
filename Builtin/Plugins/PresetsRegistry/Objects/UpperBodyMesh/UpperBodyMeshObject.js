import { Preset } from 'LensStudio:Preset';
import { BodyMeshMaterialPreset } from '../../Assets/BodyMeshMaterial/BodyMeshMaterial.js';
import { UpperBodyObjectTracking3DPreset } from '../ObjectTracking3D/ObjectTracking3D.js';
import { HeadMeshObjectPreset } from '../FaceMesh/FaceMeshObject.js';
import { PBRMaterialPreset } from '../../Assets/PBRMaterial/PBRMaterial.js';

async function createUpperBodyMeshComponent(model, destinationObject) {
    const assetManager = model.project.assetManager;

    const renderMeshVisual = destinationObject.addComponent('RenderMeshVisual');

    // Add Material
    // TODO(madiyar): Do we need upper body mesh material ?
    const bodyMeshMaterialPreset = new PBRMaterialPreset(this.pluginSystem);
    renderMeshVisual.materials = [await bodyMeshMaterialPreset.createAsync()];

    // Add Mesh
    renderMeshVisual.mesh = assetManager.createNativeAsset('UpperBodyMesh', 'Upper Body Mesh', new Editor.Path(''));

    return renderMeshVisual;
}

async function createUpperBodyMeshObject(model, sceneObject) {
    const scene = model.project.scene;

    const headMeshObjectPreset = new HeadMeshObjectPreset(this.pluginSystem);
    await headMeshObjectPreset.createAsync(sceneObject);

    const bodyTracking3DPreset = new UpperBodyObjectTracking3DPreset(this.pluginSystem);
    const bodyTrackingObject = bodyTracking3DPreset.create(sceneObject);

    const upperBodyMeshObject = scene.addSceneObject(bodyTrackingObject);
    upperBodyMeshObject.name = 'Upper Body Mesh';

    await createUpperBodyMeshComponent.call(this, model, upperBodyMeshObject);

    return upperBodyMeshObject;
}

export class UpperBodyMeshObjectPreset extends Preset {
    static descriptor() {
        return {
            id: 'Com.Snap.UpperBodyMeshObjectPreset',
            interfaces: Preset.descriptor().interfaces,
            name: 'Upper Body Mesh',
            description: '',
            icon: Editor.Icon.fromFile(import.meta.resolve('Resources/UpperBodyMesh.svg')),
            section: '3D',
            entityType: 'SceneObject'
        };
    }
    constructor(pluginSystem) {
        super(pluginSystem);
    }
    async createAsync(destination) {
        const model = this.pluginSystem.findInterface(Editor.Model.IModel);
        return await createUpperBodyMeshObject.call(this, model, destination);
    }
}
