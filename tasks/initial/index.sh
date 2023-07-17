#!/bin/(shell)

# NETWORK=kava \
# OWNER=0xFb59Ce8986943163F14C590755b29dB2998F2322 \
# sh ./tasks/initial/index.sh

npx hardhat deploy --network $NETWORK

npx hardhat deploy-ctoken \
--network $NETWORK \
--underlying-address 0x919C1c267BC06a7039e03fcc2eF738525769109c \
--underlying-decimals 6 \
--underlying-name "Tether USD" \
--underlying-symbol "USDt" \
--decimals 8 \
--comptroller-key "Unitroller" \
--interest-rate-model-key "StableRateModel" \
--owner $OWNER \
--proxy true

npx hardhat deploy-ctoken \
--network $NETWORK \
--underlying-address 0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b \
--underlying-decimals 18 \
--underlying-name "Wrapped KAVA" \
--underlying-symbol "WKAVA" \
--decimals 8 \
--comptroller-key "Unitroller" \
--interest-rate-model-key "VolatileRateModel" \
--owner $OWNER \
--proxy true

npx hardhat deploy-price-oracle --network $NETWORK

npx hardhat update-price-oracle --network $NETWORK --price-oracle-key "WitnetPriceOracle"

npx hardhat add-missing-markets --network $NETWORK