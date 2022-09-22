import UIKit

func parseReactJson<T>(_ type: T.Type, from object: [String: Any]) throws -> T where T : Decodable {
    let data = try JSONSerialization.data(withJSONObject: object, options: .init())
    let result = try JSONDecoder().decode(type, from: data)
    return result
}

func encodeReactJson<T>(_ from: T) throws -> [String: Any] where T : Encodable {
    let data = try JSONEncoder().encode(from)
    let result = try JSONSerialization.jsonObject(with: data) as! [String: Any]
    return result
}

extension UIWindow {
    func topViewController() -> UIViewController? {
        guard let rootViewController = self.rootViewController else {
            return nil
        }

        var topController = rootViewController

        while let newTopController = topController.presentedViewController {
            topController = newTopController
        }

        return topController
    }
}
