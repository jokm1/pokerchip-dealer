module Model exposing (..)

import Util exposing (..)


type alias Model =
    { pokerset : PokerSet
    , denoms : List Denomination
    , buyin : Buyin
    , players : Players
    }


type alias Players =
    Int


type alias Buyin =
    Float


type alias PokerSet =
    List (ChipsInColor {})


pokersetToString : PokerSet -> List String
pokersetToString pokerset =
    List.map chipsInColorToString pokerset


sortedByAmountDesc : PokerSet -> PokerSet
sortedByAmountDesc pokerset =
    sortWithDesc .amount <| pokerset


limitAmount : Players -> PokerSet -> PokerSet
limitAmount players pokerset =
    List.map (limitAmountOfChips players) pokerset


chipsInColorToString : ChipsInColor a -> String
chipsInColorToString { color, amount } =
    (toString amount) ++ " " ++ color ++ " chips"


type alias Stack =
    List ChipsInColorWithDenom


stackSortedByDenomination : Stack -> Stack
stackSortedByDenomination stack =
    List.sortBy .denom <| stack


type alias StackWorth =
    Float


stackWorth : Stack -> StackWorth
stackWorth stack =
    List.sum <| List.map chipValue stack


type alias ChipsInColor a =
    { a | color : String, amount : Amount }


type alias ChipsInColorWithDenom =
    ChipsInColor { denom : Denomination }


chipValue : ChipsInColorWithDenom -> Float
chipValue chips =
    toFloat chips.amount * chips.denom


updateDenomAmount : Amount -> ChipsInColorWithDenom -> ChipsInColorWithDenom
updateDenomAmount amount chips =
    { chips | amount = amount }


type alias ChipsInColorWithValue =
    { color : String, amount : Amount, value : Value }


type alias ValueStack =
    List ChipsInColorWithValue


type alias ValueStackWorth =
    Int


valueStackWorth : ValueStack -> ValueStackWorth
valueStackWorth stack =
    List.sum <| List.map chipsValue stack


chipsValue : ChipsInColorWithValue -> Int
chipsValue chips =
    chips.amount * chips.value


chipsInColorWithValueToString : ChipsInColorWithValue -> String
chipsInColorWithValueToString { color, amount, value } =
    (toString amount) ++ " " ++ color ++ " chips" ++ " with converted value of " ++ (toString value)


chipsInColorWithDenomToString : ChipsInColorWithDenom -> String
chipsInColorWithDenomToString { color, amount, denom } =
    (toString amount) ++ " " ++ color ++ " chips " ++ " valued at " ++ (toString denom)



-- Value and Denomination stuff


type alias Value =
    Int


type alias Denomination =
    Float


type alias Amount =
    Int


standardDenoms : List Denomination
standardDenoms =
    [ 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 25, 50, 100 ]


standardDenomValues : List Value
standardDenomValues =
    List.map toValue standardDenoms


toValue : Denomination -> Value
toValue denom =
    convertToDenomBase denom


toDenom : Value -> Denomination
toDenom val =
    toFloat val / denomBase


convertToDenomBase : Float -> Int
convertToDenomBase value =
    round (value * denomBase)


denomBase : number
denomBase =
    100


toChipsWithValue : ChipsInColor a -> Value -> ChipsInColorWithValue
toChipsWithValue { color, amount } value =
    ChipsInColorWithValue color amount value


toChipsWithDenomination : ChipsInColor a -> Denomination -> ChipsInColorWithDenom
toChipsWithDenomination { color, amount } denom =
    { color = color, amount = amount, denom = denom }


chipsWithDenomToValue : ChipsInColorWithDenom -> ChipsInColorWithValue
chipsWithDenomToValue { color, amount, denom } =
    ChipsInColorWithValue color amount (convertToDenomBase denom)


limitAmountOfChips : Players -> ChipsInColor a -> ChipsInColor {}
limitAmountOfChips players { color, amount } =
    { color = color, amount = (amount // players) }
