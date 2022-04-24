import AlphaQuaternion from "./Quaternion";
import AlphaRMatrix4 from "./RMatrix4";
import AlphaVector from "./Vector";

export default interface Physical {
  getViewMatrix(requestor:Physical):AlphaRMatrix4;
  getModelMatrix():AlphaRMatrix4;
  getParent():Physical;
  setParent(parent:Physical):void;
  isGoodLineageFor(prospectiveChild:Physical):boolean;
  getPosition():AlphaVector;
  getOrientation():AlphaQuaternion;
  getWorldOrientation(requestor:Physical):AlphaQuaternion;
  getWorldPosition(requestor:Physical):AlphaVector;
}
