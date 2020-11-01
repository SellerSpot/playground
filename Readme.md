# Sellerspot Multitenant Deployment flow

## Nginx_ingress installation
1. nginx ingress deploy - 
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.40.2/deploy/static/provider/do/deploy.yaml
2. nginx ingress service mod install - check ingress_nginx/nginx_svc.yaml
----------

## Cert-manager installation
1. install cert manager from kubectl apply -f cert-manager/cert-manager_v1.0.4.yaml
2. get token from cloudflare for dns resolution for obtaing ssl for wildcards *.domain.com
3. deploy issuers from cert-manager/cert_issuers/
----------


## Deploy application and provisioning cert for domains via dns01 (for owner domains) and http01 (for SNI domains(customers))
1. create specific namespace for app using kubectl create ns namespace_name
2. deploy deployment and service in the names space check example from application/deployments/
3. install ingress for the deployed service using the refrence application/ingress/
4. don't forget to mention cluster_issuer name in annotations
5. use dns01 cluster issuer for ownerdomain and wildcards owner domains
6. use http01 cluster issuer for thirdparty sni domains (cross domains multi tenant)
7. use k8s_js_client/ node client kubernets client application to automate the ingress deployment
8. this should be deployed as a pod and exposed to the world with authentication to add dynamic ingress to the application\
9. which provisions the tls cert for 3rd party domains (sni) on the go 
10. using the same js k8s_js_client the ingress can be deleted on the go 
(it helps to delete the cert and secrete associated with the ingress for that particular domain,
 it also prevents from ratelimiting on letsencrypt , thus we don't want to renew cert for the churned customer)
----------

## Additional Notes:-
1. ssl and ingress application of thirdparty customers(domains) should be
 handled carefully, and it needs to be streamlined, all edge cases needs to be handled.
