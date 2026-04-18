import { normalizePackageGalleryPaths } from "@/lib/package-gallery-images";
import fixedPackageGalleriesFromFolders from "./fixed-package-galleries.json";

/** Add-ons & specialty tours: paths listed here (JPEG). Run `npm run sync:package-galleries` for fixed itineraries. */
const manualGalleries: Record<string, string[]> = {
  "spec-village-kitchen": [
    "/images/add-ons/village-kitchen-experience/agnieszka-stankiewicz-obMdrL5pFWI-unsplash.jpg",
    "/images/add-ons/village-kitchen-experience/dinuka-lankaloka-GA6yyQN2_FU-unsplash.jpg",
    "/images/add-ons/village-kitchen-experience/ella-deane-Mm0tAZ-WFJU-unsplash.jpg",
    "/images/add-ons/village-kitchen-experience/etienne-girardet-1RHeQOwMVhg-unsplash.jpg",
    "/images/add-ons/village-kitchen-experience/foto-murthy-lXVWulsnNQE-unsplash.jpg",
    "/images/add-ons/village-kitchen-experience/jos-zwaan-50y9FjSPjGI-unsplash.jpg",
    "/images/add-ons/village-kitchen-experience/lisa-hobbs-mRaNok_Ld6s-unsplash.jpg",
    "/images/add-ons/village-kitchen-experience/sandaru-muthuwadige-TEu-lrmNahE-unsplash.jpg",
    "/images/add-ons/village-kitchen-experience/zoshua-colah-9iMvxXPtFCU-unsplash.jpg",
    "/images/add-ons/village-kitchen-experience/zoshua-colah-_WQ1qARALg4-unsplash.jpg",
    "/images/add-ons/village-kitchen-experience/zoshua-colah-adzbTddUg68-unsplash.jpg",
  ],
  "spec-nightlife": [
    "/images/add-ons/nightlife-city-lights/ajai-s-LeTov841R2g-unsplash.jpg",
    "/images/add-ons/nightlife-city-lights/arunkumar-m-vOZdhX-c_GY-unsplash.jpg",
    "/images/add-ons/nightlife-city-lights/emilia-igartua-XXRc8hkVqoc-unsplash.jpg",
    "/images/add-ons/nightlife-city-lights/levi-meir-clancy-jVnnG1iK32k-unsplash.jpg",
    "/images/add-ons/nightlife-city-lights/mahelamw-night-5889363.jpg",
    "/images/add-ons/nightlife-city-lights/matt-dany-afum06KZ9hE-unsplash.jpg",
    "/images/add-ons/nightlife-city-lights/onur-kurt-ppWfXExstGs-unsplash.jpg",
    "/images/add-ons/nightlife-city-lights/pexels-thilina-alagiyawanna-3266092-36477904.jpg",
    "/images/add-ons/nightlife-city-lights/pexels-thilina-alagiyawanna-3266092-36703577.jpg",
    "/images/add-ons/nightlife-city-lights/stergios-k-Fnzr7bRqW9c-unsplash.jpg",
    "/images/add-ons/nightlife-city-lights/zoshua-colah-1YfeT1P9ZNM-unsplash.jpg",
    "/images/add-ons/nightlife-city-lights/zoshua-colah-rxMPvBoo8Vc-unsplash.jpg",
  ],
  "spec-wellness-top-up": [
    "/images/add-ons/wellness-top-up/alan-caishan-cU53ZFBr3lk-unsplash.jpg",
    "/images/add-ons/wellness-top-up/ale-romo-CLiwQXx7kT8-unsplash.jpg",
    "/images/add-ons/wellness-top-up/christin-hume-0MoF-Fe0w0A-unsplash.jpg",
    "/images/add-ons/wellness-top-up/engin-akyurt-SMwCQZWayj0-unsplash.jpg",
    "/images/add-ons/wellness-top-up/jared-rice-NTyBbu66_SI-unsplash.jpg",
    "/images/add-ons/wellness-top-up/oswald-elsaboath-nhEIkQVj0iI-unsplash.jpg",
  ],
  "spec-shopping": [
    "/images/add-ons/curated-shopping-tours/11754907-sapphires-4071854_1920.jpg",
    "/images/add-ons/curated-shopping-tours/dmitrii-e-Rq0hqksJmyM-unsplash.jpg",
    "/images/add-ons/curated-shopping-tours/dmitrii-e-lkei65jSCzw-unsplash.jpg",
    "/images/add-ons/curated-shopping-tours/franco-antonio-giovanella-g95sf8-fEQg-unsplash.jpg",
    "/images/add-ons/curated-shopping-tours/kier-in-sight-archives-P8-woVoDT58-unsplash.jpg",
    "/images/add-ons/curated-shopping-tours/neha-maheen-mahfin-vPL-d3DjaEM-unsplash.jpg",
    "/images/add-ons/curated-shopping-tours/polina-kocheva-6w6Ud8nJKdU-unsplash.jpg",
    "/images/add-ons/curated-shopping-tours/roselie-stones-2166377_1920.jpg",
    "/images/add-ons/curated-shopping-tours/sander-traa-8qfgMXpRYhQ-unsplash.jpg",
    "/images/add-ons/curated-shopping-tours/simon-e5pdoTUKoW0-unsplash.jpg",
    "/images/add-ons/curated-shopping-tours/stock-birken-I-sxAOzpptQ-unsplash.jpg",
    "/images/add-ons/curated-shopping-tours/stock-birken-hQvAGR808-g-unsplash.jpg",
    "/images/add-ons/curated-shopping-tours/takemaru-hirai-poi_3wJHaoU-unsplash.jpg",
    "/images/add-ons/curated-shopping-tours/zoshua-colah-3k8fJaNnXhg-unsplash.jpg",
  ],
  "spec-wildlife-photography": [
    "/images/special-tours/wildlife-photography-tours/13.jpg",
    "/images/special-tours/wildlife-photography-tours/2.jpg",
    "/images/special-tours/wildlife-photography-tours/7.jpg",
    "/images/special-tours/wildlife-photography-tours/974fd9be-b6cc-4920-8cdf-d6d849d99bd3.jpg",
    "/images/special-tours/wildlife-photography-tours/IMG_3230.JPG",
    "/images/special-tours/wildlife-photography-tours/IMG_3231.JPG",
    "/images/special-tours/wildlife-photography-tours/IMG_3257.JPG",
    "/images/special-tours/wildlife-photography-tours/IMG_3270.JPG",
    "/images/special-tours/wildlife-photography-tours/anupa-uthsara-iZo_xVpa0HI-unsplash.jpg",
    "/images/special-tours/wildlife-photography-tours/august-zhang-vGaWCYZangs-unsplash.jpg",
    "/images/special-tours/wildlife-photography-tours/chanuka-nimsara-vJTKWsDIkQA-unsplash.jpg",
    "/images/special-tours/wildlife-photography-tours/dulana-kodithuwakku-P562lXSaebE-unsplash.jpg",
    "/images/special-tours/wildlife-photography-tours/dulana-kodithuwakku-aIcpZnCpp4Q-unsplash.jpg",
    "/images/special-tours/wildlife-photography-tours/sach-kKeC_lgVs_o-unsplash.jpg",
    "/images/special-tours/wildlife-photography-tours/udara-karunarathna-PPGM2ZpCrzc-unsplash.jpg",
  ],
  "spec-longterm": [
    "/images/special-tours/long-stay-holidays/9.jpg",
    "/images/special-tours/long-stay-holidays/IMG_3017.JPG",
    "/images/special-tours/long-stay-holidays/zoshua-colah-pogedsVnKJE-unsplash.jpg",
    "/images/special-tours/long-stay-holidays/zoshua-colah-vCcKer6nYHc-unsplash.jpg",
  ],
  "spec-volunteer-program": [
    "/images/special-tours/volunteer-program-tours/austin-kehmeier-lyiKExA4zQA-unsplash.jpg",
    "/images/special-tours/volunteer-program-tours/hannah-busing-Zyx1bK9mqmA-unsplash.jpg",
    "/images/special-tours/volunteer-program-tours/larm-rmah-AEaTUnvneik-unsplash.jpg",
  ],
  "spec-adventure-adrenaline": [
    "/images/special-tours/adventure-adrenaline-tour/ikshit-chaudhari-xg2R3X6L13U-unsplash.jpg",
    "/images/special-tours/adventure-adrenaline-tour/jackalope-west-02HBQ2w_yak-unsplash.jpg",
    "/images/special-tours/adventure-adrenaline-tour/juliette-g-bmBLu_oAEj8-unsplash.jpg",
    "/images/special-tours/adventure-adrenaline-tour/juliette-g-jX61Kll0Q5g-unsplash.jpg",
    "/images/special-tours/adventure-adrenaline-tour/kelly-sikkema-0SYAZsa1Hgo-unsplash.jpg",
    "/images/special-tours/adventure-adrenaline-tour/loren-dosti-M8cpBt6RSns-unsplash.jpg",
    "/images/special-tours/adventure-adrenaline-tour/raimond-klavins-xAqrT-279UA-unsplash.jpg",
  ],
};

const galleries: Record<string, string[]> = {
  ...(fixedPackageGalleriesFromFolders as Record<string, string[]>),
  ...manualGalleries,
};

export const fixedPackageGalleryById: Record<string, string[]> = Object.fromEntries(
  Object.entries(galleries).map(([id, paths]) => [
    id,
    normalizePackageGalleryPaths(paths),
  ]),
) as Record<string, string[]>;
