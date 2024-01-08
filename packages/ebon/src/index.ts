import { Behavior } from './modules/behavior/Behavior';
import { Ebon, EbonContainer } from './modules/ebon/Ebon';
import { Camera } from './modules/entity/Camera';
import { Entity } from './modules/entity/Entity';
import { Keyboard } from './modules/keyboard/behavior';
import { Scene } from './modules/scene/Scene';

export { useEbonInterface } from './lib/zustand';
export { InterfaceAnchored } from './modules/interface/behavior';

const a = 5;

export { Behavior, Camera, Ebon, EbonContainer, Entity, Keyboard, Scene };
