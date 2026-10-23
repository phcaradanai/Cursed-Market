"""Derive a foreground matte from existing art; never generate new item pixels.

Requires opencv-python-headless. Run from this folder; output is used by demo.
Coarse foreground/background scribbles guide GrabCut's pixel segmentation.
"""
from pathlib import Path
import cv2
import numpy as np

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parents[2] / 'src/appraisal-client/public/art/item-key.jpg'
image = cv2.imread(str(SOURCE))
mask = np.zeros(image.shape[:2], np.uint8)
# Broad plausible region; the final boundary is inferred from source pixels.
outline = np.array([(43,43),(210,35),(310,73),(326,185),(377,263),
 (558,447),(667,459),(740,565),(744,624),(690,704),(630,704),
 (563,619),(487,538),(342,397),(253,319),(121,320),(47,266),(34,139)])
cv2.fillPoly(mask, [outline], cv2.GC_PR_FGD)
# Definite object samples along the metal ring, shaft, and teeth.
cv2.ellipse(mask,(184,177),(111,111),-30,0,360,cv2.GC_FGD,8)
cv2.line(mask,(272,269),(648,650),cv2.GC_FGD,20)
cv2.line(mask,(604,559),(670,496),cv2.GC_FGD,9)
cv2.line(mask,(637,596),(704,532),cv2.GC_FGD,9)
cv2.line(mask,(666,626),(724,574),cv2.GC_FGD,9)
# Ring opening is background, not a glowing disc.
cv2.ellipse(mask,(184,177),(67,69),-30,0,360,cv2.GC_BGD,-1)
cv2.setRNGSeed(17)
cv2.grabCut(image,mask,None,np.zeros((1,65)),np.zeros((1,65)),6,cv2.GC_INIT_WITH_MASK)
alpha = np.where((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD),255,0).astype('uint8')
# Keep anti-aliasing narrow to avoid tinting background pixels.
alpha=cv2.GaussianBlur(alpha,(3,3),0.6)
rgba=cv2.cvtColor(image,cv2.COLOR_BGR2BGRA)
rgba[:,:,3]=alpha
cv2.imwrite(str(HERE/'key-cutout.png'),rgba)
cv2.imwrite(str(HERE/'key-glow.png'),cv2.GaussianBlur(alpha,(0,0),12))
print(f'Foreground coverage: {np.mean(alpha>128):.1%}; source unchanged: {SOURCE}')
