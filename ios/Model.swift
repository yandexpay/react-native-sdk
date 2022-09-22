import YandexPaySDK

struct InitConfiguration: Codable {
    let merchant: Merchant
    let env: PaymentEnv
    let lang: Language

    var toSDK: YandexPaySDKConfiguration {
        return YandexPaySDKConfiguration(
            environment: env.toSDK,
            merchant: merchant.toSDK,
            locale: lang.toSDK
        )
    }
}

struct Merchant: Codable {
    let id: String
    let name: String
    let url: String
    
    var toSDK: YandexPaySDKMerchant {
        return YandexPaySDKMerchant(
            id: id,
            name: name,
            url: url
        )
    }
}

enum PaymentEnv: String, Codable {
    case PRODUCTION
    case SANDBOX
    
    var toSDK: YandexPaySDK.YandexPaySDKEnvironment {
        switch self {
        case .PRODUCTION:
            return .production
        case .SANDBOX:
            return .sandbox
        }
    }
}

enum Language: String, Codable {
    case ru
    case en
    case system
    
    var toSDK: YandexPaySDK.YandexPaySDKLocale {
        switch self {
        case .ru:
            return .ru
        case .en:
            return .en
        case .system:
            return .system
        }
    }
}

struct PaymentSheet: Codable {
    let currencyCode: CurrencyCode
    let cart: PaymentCart
    let orderId: String?
    let metadata: String?

    var toSDK: YPCheckoutPaymentSheet? {
        var ypmetadata: YPMetadata? = nil
        if let metadata = metadata {
            ypmetadata = YPMetadata(value: metadata)
        }
        
        return YPCheckoutPaymentSheet(
            currencyCode: currencyCode.toSDK,
            cart: cart.toSDK,
            orderId: orderId,
            metadata: ypmetadata
        )
    }
}

enum CurrencyCode: String, Codable {
    case RUB
    case BYN
    case USD
    case EUR
    case KZT
    case UAH
    case AMD
    case GEL
    case AZN
    case KGS
    case GBP
    case SEK
    case PLN
    case INR
    case CZK
    case CAD
    case BRL
    case AUD
    case UZS

    var toSDK: YPCurrencyCode {
        switch self {
        case .RUB:
            return .rub
        case .BYN:
            return .byn
        case .USD:
            return .usd
        case .EUR:
            return .eur
        case .KZT:
            return .kzt
        case .UAH:
            return .uah
        case .AMD:
            return .amd
        case .GEL:
            return .gel
        case .AZN:
            return .azn
        case .KGS:
            return .kgs
        case .GBP:
            return .gbp
        case .SEK:
            return .sek
        case .PLN:
            return .pln
        case .INR:
            return .inr
        case .CZK:
            return .czk
        case .CAD:
            return .cad
        case .BRL:
            return .brl
        case .AUD:
            return .aud
        case .UZS:
            return .uzs
        }
    }
}

struct PaymentCart: Codable {
    let items: [Product]
    
    var toSDK: YPPaymentCart {
        return YPPaymentCart(
            items: items.map { $0.toSDK }
        )
    }
}

struct Product: Codable {
    let id: String
    let total: String
    let quantity: Quantity?

    var toSDK: YPProduct {
        return YPProduct(
            id: id,
            total: total,
            quantity: quantity.map { $0.toSDK }
        )
    }
}

struct Quantity: Codable {
    let count: String
    
    var toSDK: YPQuantity {
        return YPQuantity(count: count)
    }
}

enum ButtonTheme: String, Codable {
    case dark
    case light
    case system
    
    var toSDK: YandexPayButtonApperance {
        switch self {
        case .dark:
            return .dark
        case .light:
            return .light
        case .system:
            switch UIScreen.main.traitCollection.userInterfaceStyle {
              case .dark:
                return .light
              case .light, .unspecified:
                return .dark
            }
        }
    }
}

extension YandexPayButtonApperance {
    var toTheme: YandexPayButtonTheme {
        if #available(iOS 13.0, *) {
            return YandexPayButtonTheme(appearance: self, dynamic: true)
        } else {
            return YandexPayButtonTheme(appearance: self)
        }
    }
}

struct CheckoutInfo: Codable {
    let orderId: String
    let metadata: String?
}

extension YPCheckoutInfo {
    var toJS: CheckoutInfo {
        return CheckoutInfo(
            orderId: orderId,
            metadata: metadata
        )
    }
}

struct CheckoutError: Codable {
    let reason: String?
}

extension YPCheckoutError {
    var toJS: CheckoutError {
        return CheckoutError(
            reason: reason
        )
    }
}

