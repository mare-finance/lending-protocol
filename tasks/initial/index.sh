#!/bin/(shell)

# NETWORK=localhost \
# OWNER=0xFb59Ce8986943163F14C590755b29dB2998F2322 \
# sh ./tasks/initial/index.sh

npx hardhat deploy --network $NETWORK

npx hardhat deploy-ctoken \
--network $NETWORK \
--underlying-address 0xfA9343C3897324496A05fC75abeD6bAC29f8A40f \
--underlying-decimals 6 \
--underlying-name "USD Coin" \
--underlying-symbol "USDC" \
--decimals 8 \
--comptroller-key "Unitroller" \
--interest-rate-model-key "StableRateModel" \
--owner $OWNER

npx hardhat deploy-ctoken \
--network $NETWORK \
--underlying-address 0xB44a9B6905aF7c801311e8F4E76932ee959c663C \
--underlying-decimals 6 \
--underlying-name "Tether USD" \
--underlying-symbol "USDT" \
--decimals 8 \
--comptroller-key "Unitroller" \
--interest-rate-model-key "StableRateModel" \
--owner $OWNER

npx hardhat deploy-ctoken \
--network $NETWORK \
--underlying-address 0x765277EebeCA2e31912C9946eAe1021199B39C61 \
--underlying-decimals 18 \
--underlying-name "Dai Stablecoin" \
--underlying-symbol "DAI" \
--decimals 8 \
--comptroller-key "Unitroller" \
--interest-rate-model-key "StableRateModel" \
--owner $OWNER

npx hardhat deploy-ctoken \
--network $NETWORK \
--underlying-address 0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b \
--underlying-decimals 18 \
--underlying-name "Wrapped KAVA" \
--underlying-symbol "WKAVA" \
--decimals 8 \
--comptroller-key "Unitroller" \
--interest-rate-model-key "VolatileRateModel" \
--owner $OWNER

npx hardhat deploy-price-oracle --network $NETWORK

npx hardhat update-price-oracle --network $NETWORK --price-oracle-key "WitnetPriceOracle"

npx hardhat add-missing-markets --network $NETWORK