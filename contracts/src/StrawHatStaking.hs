-- StrawHat DeFi Platform - Staking Contract
-- A Plutus smart contract for token staking and reward distribution

{-# LANGUAGE DataKinds             #-}
{-# LANGUAGE FlexibleContexts      #-}
{-# LANGUAGE NoImplicitPrelude     #-}
{-# LANGUAGE OverloadedStrings     #-}
{-# LANGUAGE ScopedTypeVariables   #-}
{-# LANGUAGE TemplateHaskell       #-}
{-# LANGUAGE TypeApplications      #-}
{-# LANGUAGE TypeFamilies          #-}
{-# LANGUAGE TypeOperators         #-}

module StrawHatStaking where

import           Control.Monad        hiding (fmap)
import           Data.Aeson           (ToJSON, FromJSON)
import           Data.Map             as Map
import           Data.Text            (Text)
import           Data.Void            (Void)
import           GHC.Generics         (Generic)
import           Plutus.Contract      as Contract
import           Plutus.Tx            (Data (..))
import qualified Plutus.Tx
import           Plutus.Tx.Prelude    hiding (Semigroup(..), unless)
import           Ledger               hiding (mint, singleton)
import qualified Ledger.Constraints   as Constraints
import qualified Ledger.Scripts       as Scripts
import           Ledger.Ada           as Ada
import           Ledger.Value         as Value
import           Playground.Contract  (printJson, printSchemas, ensureKnownCurrencies, stage, ToSchema)
import           Playground.TH        (mkKnownCurrencies, mkSchemaDefinitions)
import           Playground.Types     (KnownCurrency (..))
import           Prelude              (IO, Semigroup (..), String)
import qualified Prelude

-- | Staking parameters
data StakingParams = StakingParams
    { spOwner           :: !PaymentPubKeyHash  -- Contract owner
    , spMinStake        :: !Integer            -- Minimum stake amount
    , spRewardRate      :: !Integer            -- Reward rate per epoch
    , spLockPeriod      :: !POSIXTime          -- Minimum lock period
    } deriving (Show, Generic, ToJSON, FromJSON, ToSchema)

-- | Staking datum
data StakingDatum = StakingDatum
    { sdStaker          :: !PaymentPubKeyHash  -- Staker's address
    , sdAmount          :: !Integer            -- Staked amount
    , sdStartTime       :: !POSIXTime          -- Stake start time
    , sdLastReward      :: !POSIXTime          -- Last reward claim time
    } deriving (Show, Generic, ToJSON, FromJSON, ToSchema)

-- | Staking redeemer actions
data StakingRedeemer = Stake | Unstake | ClaimRewards | UpdateParams
    deriving (Show, Generic, ToJSON, FromJSON, ToSchema)

-- | Convert to Plutus Data
Plutus.Tx.unstableMakeIsData ''StakingParams
Plutus.Tx.unstableMakeIsData ''StakingDatum
Plutus.Tx.unstableMakeIsData ''StakingRedeemer

-- | Staking validator
{-# INLINABLE mkStakingValidator #-}
mkStakingValidator :: StakingParams -> StakingDatum -> StakingRedeemer -> ScriptContext -> Bool
mkStakingValidator params datum redeemer ctx =
    case redeemer of
        Stake -> validateStake
        Unstake -> validateUnstake
        ClaimRewards -> validateClaimRewards
        UpdateParams -> validateUpdateParams
  where
    info :: TxInfo
    info = scriptContextTxInfo ctx

    ownInput :: TxOut
    ownInput = case getContinuingOutputs ctx of
        [o] -> o
        _   -> traceError "Expected exactly one continuing output"

    validateStake :: Bool
    validateStake = traceIfFalse "Minimum stake not met" checkMinStake &&
                   traceIfFalse "Invalid staking time" checkStakeTime
      where
        checkMinStake = sdAmount datum >= spMinStake params
        checkStakeTime = sdStartTime datum <= txInfoValidRange info

    validateUnstake :: Bool
    validateUnstake = traceIfFalse "Lock period not met" checkLockPeriod &&
                     traceIfFalse "Not staker" checkStaker
      where
        checkLockPeriod = sdStartTime datum + spLockPeriod params <= txInfoValidRange info
        checkStaker = txSignedBy info (unPaymentPubKeyHash $ sdStaker datum)

    validateClaimRewards :: Bool
    validateClaimRewards = traceIfFalse "Not staker" checkStaker &&
                          traceIfFalse "No rewards available" checkRewardsAvailable
      where
        checkStaker = txSignedBy info (unPaymentPubKeyHash $ sdStaker datum)
        checkRewardsAvailable = calculateRewards > 0

    validateUpdateParams :: Bool
    validateUpdateParams = traceIfFalse "Not owner" checkOwner
      where
        checkOwner = txSignedBy info (unPaymentPubKeyHash $ spOwner params)

    calculateRewards :: Integer
    calculateRewards = 
        let timeDiff = sdLastReward datum - sdStartTime datum
            epochsPassed = timeDiff `divide` 86400000 -- 1 day in milliseconds
        in (sdAmount datum * spRewardRate params * epochsPassed) `divide` 10000

-- | Compile the validator
stakingValidator :: StakingParams -> Scripts.Validator
stakingValidator params = Scripts.validatorScript $ 
    $$(Plutus.Tx.compile [|| mkStakingValidator ||])
    `Plutus.Tx.applyCode` 
    Plutus.Tx.liftCode params

-- | Contract endpoints
type StakingSchema = 
        Endpoint "stake" StakeParams
    .\/ Endpoint "unstake" UnstakeParams  
    .\/ Endpoint "claimRewards" ClaimRewardsParams
    .\/ Endpoint "getStakeInfo" PaymentPubKeyHash

-- | Stake parameters
data StakeParams = StakeParams
    { spAmount :: !Integer
    } deriving (Show, Generic, ToJSON, FromJSON, ToSchema)

-- | Unstake parameters  
data UnstakeParams = UnstakeParams
    { upAmount :: !(Maybe Integer) -- Nothing means unstake all
    } deriving (Show, Generic, ToJSON, FromJSON, ToSchema)

-- | Claim rewards parameters
data ClaimRewardsParams = ClaimRewardsParams
    deriving (Show, Generic, ToJSON, FromJSON, ToSchema)

-- | Contract implementation
stakingContract :: StakingParams -> Contract () StakingSchema Text ()
stakingContract params = do
    logInfo @String $ "Starting StrawHat Staking Contract"
    selectList [stake', unstake', claimRewards', getStakeInfo'] >> stakingContract params
  where
    stake' = endpoint @"stake" $ \sp -> do
        logInfo @String $ "Staking " ++ show (spAmount sp) ++ " tokens"
        -- Implementation details...
        
    unstake' = endpoint @"unstake" $ \up -> do
        logInfo @String $ "Unstaking tokens"
        -- Implementation details...
        
    claimRewards' = endpoint @"claimRewards" $ \_ -> do
        logInfo @String $ "Claiming rewards"
        -- Implementation details...
        
    getStakeInfo' = endpoint @"getStakeInfo" $ \pkh -> do
        logInfo @String $ "Getting stake info for " ++ show pkh
        -- Implementation details...

-- | Playground boilerplate
mkSchemaDefinitions ''StakingSchema
mkKnownCurrencies []