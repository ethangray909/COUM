echo ".....Patching podSpecs......."
cp Patches/ReactNativeART.podspec ../node_modules/@react-native-community/art/ReactNativeART.podspec
cp Patches/react-native-geolocation.podspec ../node_modules/@react-native-community/geolocation/react-native-geolocation.podspec
cp Patches/react-native-blur.podspec ../node_modules/@react-native-community/blur/react-native-blur.podspec
cp Patches/RNCMaskedView.podspec ../node_modules/@react-native-community/masked-view/RNCMaskedView.podspec

cp Patches/react-native-fbsdk.podspec ../node_modules/react-native-fbsdk/react-native-fbsdk.podspec
cp Patches/RNFS.podspec ../node_modules/react-native-fs/RNFS.podspec
cp Patches/RNSVG.podspec ../node_modules/react-native-svg/RNSVG.podspec
cp Patches/tipsi-stripe.podspec ../node_modules/tipsi-stripe/tipsi-stripe.podspec
cp Patches/BVLinearGradient.podspec ../node_modules/react-native-linear-gradient/BVLinearGradient.podspec
cp Patches/react-native-appearance.podspec ../node_modules/react-native-appearance/react-native-appearance.podspec

echo ".....Patch completed......."
