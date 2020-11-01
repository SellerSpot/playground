const k8s = require('@kubernetes/client-node')
const kc = new k8s.KubeConfig()
kc.loadFromDefault()

const k8sApi = kc.makeApiClient(k8s.NetworkingV1beta1Api);
const hostName = 'bite.openbeats.live';
const ingressName = `sellerspot-poc-ingress-${hostName}`;
const nameSpace = 'poc';
const create = true;
const issuer = "letsencrypt-prod";
const serviceName = "obs-captainapp";
const servicePort = 3000;
const servicePath = "/"

if (create) {
    k8sApi.createNamespacedIngress(nameSpace, {
        apiVersion: 'networking.k8s.io/v1beta1',
        kind: 'Ingress',
        metadata: {
            name: ingressName,
            nameSpace: nameSpace,
            annotations: {
                "kubernetes.io/ingress.class": "nginx",
                "cert-manager.io/cluster-issuer": issuer
            }
        },
        spec: {
            rules: [
                {
                    host: hostName,
                    http: {
                        paths: [
                            {
                                path: servicePath,
                                backend: {
                                    serviceName: serviceName,
                                    servicePort: servicePort
                                }

                            }
                        ]
                    }
                }
            ],
            tls: [
                {
                    hosts: [
                        hostName
                    ],
                    secretName: hostName
                }
            ]
        }
    }).then((res) => {
        console.log("success creating ingress", res.body)
    }).catch(e => console.log("error creating ingress", e.response.body))
} else {
    k8sApi.deleteNamespacedIngress(ingressName, nameSpace)
        .then((res) => console.log("success deleteing ingress", res.body))
        .catch((err) => console.log("Error deleting ingress", err.response.body));
}
