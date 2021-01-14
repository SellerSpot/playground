# Sellerspot Multitenant Deployment flow

## Nginx_ingress installation

1. nginx ingress deploy -
   ```
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.40.2/deploy/static/provider/do/deploy.yaml
   ```
2. nginx ingress service mod install - check

   ```
   Kubectl apply -f ingress-nginx/nginx-svc.yaml
   ```

---

## Cert-manager installation

1. Install cert manager from
   ```
   kubectl apply -f cert-manager/cert-manager_v1.0.4.yaml
   ```
2. Get token from cloudflare for DNS resolution for obtaing ssl for wildcards **\*.domain.com** from letsencrypt.

3. Add Cloudflare DNS access token to secret using

   ```
   kubectl apply -f cert-manager/sellerspotdev.tech-cloudflare-secret.yaml
   ```

   **Note :**

   1. Install at your required namespace - usually it is suggested to wrap all the app content in a namespace other than default.

   2. Replace the secret and its name as per the requirement.

4. Deploy issuers from `cert-manager/cert_issuers/ ` - it helps to issue certificates to the domains. it has both http01 and dns01 resolution issuers. consume accordingly based on the requirement.

   **Issuer Apply Commands**

   ```
        **For Staging**

        kubectl apply -f cert-manager/cert-issuers/letsencrypt-staging.yaml
        kubectl apply -f cert-manager/cert-issuers/letsencrypt-staging-dns.yaml

        **For Production**

        kubectl apply -f cert-manager/cert-issuers/letsencrypt-production.yaml
        kubectl apply -f cert-manager/cert-issuers/letsencrypt-production-dns.yaml

   ```

   **Note :**

   1. Use staging and check whether cert_issuers works fine with above steps. - it also helps not to destroy the rate limit of production issuer from letsencrypt.

   2. Apply staging issuers and deploy and test the app, once the successfull https redirection (cert assignment from letsencrypt), move it to production issuers.

---

## Deploy application and Provision cert for domains via dns01 (for owner domains (wildcard domains)) and http01 (for SNI domains(customers))

1. Create specific `namespace for app` using kubectl create ns namespace_name

   ```
       kubectl create ns app
   ```

2. Deploy deployment and service in the names space check example from `application/deployments/`

3. Install ingress for the deployed service using the refrence
   `application/ingress/`

4. Don't forget to mention cluster_issuer name in annotations.

5. Use dns01 cluster issuer for ownerdomain and wildcards owner domains.

6. Use http01 cluster issuer for thirdparty sni domains (cross domains multi tenant).

7. Use k8s_js_client/ node client kubernets client application to automate the ingress deployment.

8. This should be deployed as a pod and exposed to the world with authentication to add dynamic ingress to the application.

9. Which provisions the tls cert for 3rd party domains (sni) on the go.

10. Using the same js k8s_js_client the ingress can be deleted on the go.

    ( It helps to delete the cert and secrete associated with the ingress for that particular domain,
    it also prevents from ratelimiting on letsencrypt , thus we don't want to renew cert for the churned customer ).

---

## Additional Notes :

1. ssl and ingress application of thirdparty customers(domains) should be
   handled carefully, and it needs to be streamlined, all edge cases needs to be handled.
