import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"

gsap.registerPlugin(CustomEase)

CustomEase.create("shiftReveal", "0.32,0.94,0.6,1")
CustomEase.create("shiftTitle", "0.26,1,0.48,1")
CustomEase.create("shiftRule", "0.22,1,0.36,1")
