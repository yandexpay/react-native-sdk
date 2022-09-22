import YandexPaySDK
import UIKit

@objc(YandexPay)
class YandexPay: NSObject {
    @objc(initialize:withResolver:withRejecter:)
    func initialize(config: [String: Any], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        DispatchQueue.main.async {
            do {
                let config = try parseReactJson(InitConfiguration.self, from: config)
                try YandexPaySDKApi.initialize(configuration: config.toSDK)
                resolve(())
            } catch {
                reject("init_failed", "Failed to initialize YandexPaySDK", (error as NSError))
            }
        }
    }
}

@objc(YandexPayCheckoutButtonViewManager)
class YandexPayCheckoutButtonViewManager: RCTViewManager {
    override func constantsToExport() -> [AnyHashable : Any]! {
        return [
            "DefaultHeight" : 54.0,
        ]
    }
    
  override func view() -> UIView! {
      let view = YandexPayCheckoutButtonView()
      let theme = view.theme.toSDK.toTheme
      let configuration = YandexPayButtonConfiguration(theme: theme)
      let payButton = YandexPaySDKApi.instance.createCheckoutButton(configuration: configuration, delegate: view)
      view.attach(payButton: payButton)
      return view
  }

  override static func requiresMainQueueSetup() -> Bool {
      return true
  }
}

class YandexPayCheckoutButtonView: UIView, YandexPayCheckoutButtonDelegate {
    private var payButton: YandexPayButton!
    
    var theme: ButtonTheme = .dark {
        didSet {
            guard theme != oldValue else { return }
            payButton.setTheme(theme.toSDK.toTheme, animated: false)
        }
    }
    @objc(theme) var _theme: String {
        set { self.theme = ButtonTheme(rawValue: newValue) ?? .dark }
        get { self.theme.rawValue }
    }
    
    var paymentSheet: PaymentSheet?
    @objc(paymentSheet) var _paymentSheet: [String: Any]? {
        didSet {
            self.paymentSheet = try? parseReactJson(PaymentSheet.self, from: _paymentSheet!)
        }
    }
    
    @objc var onCheckoutSuccess: RCTDirectEventBlock?
    @objc var onCheckoutAbort: RCTDirectEventBlock?
    @objc var onCheckoutError: RCTDirectEventBlock?

    override init(frame:CGRect) {
      super.init(frame: frame)
    }
    
    required init?(coder aDecoder: NSCoder) {
      fatalError("init(coder:) has not been implemented")
    }
    
    convenience init() {
        self.init(frame: .zero)
    }
    
    func attach(payButton: YandexPayButton) {
        self.payButton = payButton
        self.addSubview(payButton)
        
        // Match parent size
        payButton.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        payButton.frame = bounds
    }
    
    func yandexPayCheckoutButton(_ button: YandexPayButton, didCompletePaymentWithResult result: YPCheckoutResult) {
        switch result {
        case .succeeded(let result):
            onCheckoutSuccess?(try? encodeReactJson(result.toJS))
        case .cancelled:
            onCheckoutAbort?(nil)
        case .failed(let error):
            onCheckoutError?(try? encodeReactJson(error.toJS))
        }
    }
    
    func yandexPayCheckoutButtonDidRequestViewControllerForPresentation(_ button: YandexPayButton) -> UIViewController? {
        return UIApplication.shared.keyWindow?.topViewController()
    }
    
    func yandexPayCheckoutButtonDidRequestPaymentSheet(_ button: YandexPayButton) -> YPCheckoutPaymentSheet? {
        return paymentSheet?.toSDK
    }
}
