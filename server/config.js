'use strict';
const path=require('node:path');
const crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const bool=(v,d=false)=>v==null?d:['1','true','yes','on'].includes(String(v).toLowerCase());
const int=(v,d,min,max)=>{const n=Number(v);return Number.isFinite(n)?Math.max(min,Math.min(max,Math.round(n))):d};
function loadConfig(overrides={}){
  const env=overrides.env||process.env.NODE_ENV||'development',production=env==='production';
  const cfg={
    env,production,
    host:overrides.host||process.env.HOST||(production?'0.0.0.0':'127.0.0.1'),
    port:int(overrides.port??process.env.PORT,4180,1,65535),
    dbFile:overrides.dbFile||overrides.databaseFile||process.env.PRO4X4_DB||path.join(ROOT,'runtime','rigbuilder.sqlite'),
    assetVaultDir:overrides.assetVaultDir||process.env.PRO4X4_ASSET_VAULT||path.join(ROOT,'runtime','asset-vault'),
    assetStorageDriver:String(overrides.assetStorageDriver||process.env.PRO4X4_ASSET_STORAGE_DRIVER||'local').toLowerCase(),
    assetS3Endpoint:overrides.assetS3Endpoint||process.env.PRO4X4_ASSET_S3_ENDPOINT||'',
    assetS3Bucket:overrides.assetS3Bucket||process.env.PRO4X4_ASSET_S3_BUCKET||'',
    assetS3Region:overrides.assetS3Region||process.env.PRO4X4_ASSET_S3_REGION||'us-east-1',
    assetS3AccessKeyId:overrides.assetS3AccessKeyId||process.env.PRO4X4_ASSET_S3_ACCESS_KEY_ID||'',
    assetS3SecretAccessKey:overrides.assetS3SecretAccessKey||process.env.PRO4X4_ASSET_S3_SECRET_ACCESS_KEY||'',
    assetS3SessionToken:overrides.assetS3SessionToken||process.env.PRO4X4_ASSET_S3_SESSION_TOKEN||'',
    assetS3ForcePathStyle:overrides.assetS3ForcePathStyle??bool(process.env.PRO4X4_ASSET_S3_FORCE_PATH_STYLE,true),
    assetCdnBaseUrl:overrides.assetCdnBaseUrl||process.env.PRO4X4_ASSET_CDN_BASE_URL||'',
    assetSignedUrlTtlSeconds:int(overrides.assetSignedUrlTtlSeconds??process.env.PRO4X4_ASSET_SIGNED_URL_TTL_SECONDS,300,30,3600),
    assetDeliverySecret:overrides.assetDeliverySecret||process.env.PRO4X4_ASSET_DELIVERY_SECRET||(production?crypto.randomBytes(32).toString('hex'):'development-asset-delivery-secret-change-me-please'),
    assetDeliverySecretEphemeral:!(overrides.assetDeliverySecret||process.env.PRO4X4_ASSET_DELIVERY_SECRET),
    publicOrigin:overrides.publicOrigin||process.env.PRO4X4_PUBLIC_ORIGIN||'',
    trustProxy:overrides.trustProxy??bool(process.env.PRO4X4_TRUST_PROXY,false),
    allowPrototypeHeaders:overrides.allowPrototypeHeaders??bool(process.env.PRO4X4_ALLOW_PROTOTYPE_HEADERS,!production),
    allowDevLogin:overrides.allowDevLogin??bool(process.env.PRO4X4_ALLOW_DEV_LOGIN,!production),
    secureCookies:overrides.secureCookies??bool(process.env.PRO4X4_SECURE_COOKIES,production),
    sessionTtlMinutes:int(overrides.sessionTtlMinutes??process.env.PRO4X4_SESSION_TTL_MINUTES,480,15,10080),
    requestBodyLimitBytes:int(overrides.requestBodyLimitBytes??process.env.PRO4X4_REQUEST_BODY_LIMIT_BYTES,2_000_000,64_000,20_000_000),
    backupBodyLimitBytes:int(overrides.backupBodyLimitBytes??process.env.PRO4X4_BACKUP_BODY_LIMIT_BYTES,20_000_000,1_000_000,100_000_000),
    assetBodyLimitBytes:int(overrides.assetBodyLimitBytes??process.env.PRO4X4_ASSET_BODY_LIMIT_BYTES,25_000_000,1_000_000,100_000_000),
    rateLimitWindowMs:int(overrides.rateLimitWindowMs??process.env.PRO4X4_RATE_LIMIT_WINDOW_MS,60_000,1_000,3_600_000),
    rateLimitMax:int(overrides.rateLimitMax??process.env.PRO4X4_RATE_LIMIT_MAX,production?180:1200,10,10000),
    authRateLimitMax:int(overrides.authRateLimitMax??process.env.PRO4X4_AUTH_RATE_LIMIT_MAX,30,3,500),
    authGatewayEnabled:overrides.authGatewayEnabled??bool(process.env.PRO4X4_AUTH_GATEWAY_ENABLED,false),
    authGatewaySecret:overrides.authGatewaySecret??(process.env.PRO4X4_AUTH_GATEWAY_SECRET||''),
    authGatewayEmailDomain:overrides.authGatewayEmailDomain??(process.env.PRO4X4_AUTH_GATEWAY_EMAIL_DOMAIN||''),
    authGatewayMaxSkewSeconds:int(overrides.authGatewayMaxSkewSeconds??process.env.PRO4X4_AUTH_GATEWAY_MAX_SKEW_SECONDS,60,10,300),
    metricsEnabled:overrides.metricsEnabled??bool(process.env.PRO4X4_METRICS_ENABLED,true),
    metricsToken:overrides.metricsToken??(process.env.PRO4X4_METRICS_TOKEN||'')
  };
  if(cfg.publicOrigin){try{cfg.publicOrigin=new URL(cfg.publicOrigin).origin}catch{throw new Error('PRO4X4_PUBLIC_ORIGIN must be a valid absolute origin')}}
  if(production&&cfg.allowDevLogin)throw new Error('PRO4X4_ALLOW_DEV_LOGIN must be disabled in production');
  if(production&&cfg.allowPrototypeHeaders)throw new Error('PRO4X4_ALLOW_PROTOTYPE_HEADERS must be disabled in production');
  if(cfg.authGatewayEnabled&&!cfg.authGatewaySecret)throw new Error('PRO4X4_AUTH_GATEWAY_SECRET is required when auth gateway is enabled');
  if(!['local','s3'].includes(cfg.assetStorageDriver))throw new Error('PRO4X4_ASSET_STORAGE_DRIVER must be local or s3');
  if(cfg.assetStorageDriver==='s3'){
    for(const [name,value] of [['PRO4X4_ASSET_S3_ENDPOINT',cfg.assetS3Endpoint],['PRO4X4_ASSET_S3_BUCKET',cfg.assetS3Bucket],['PRO4X4_ASSET_S3_ACCESS_KEY_ID',cfg.assetS3AccessKeyId],['PRO4X4_ASSET_S3_SECRET_ACCESS_KEY',cfg.assetS3SecretAccessKey]])if(!value)throw new Error(`${name} is required for s3 asset storage`);
    try{const u=new URL(cfg.assetS3Endpoint);if(!/^https?:$/.test(u.protocol))throw new Error();if(production&&u.protocol!=='https:')throw new Error('PRO4X4_ASSET_S3_ENDPOINT must use HTTPS in production')}catch(e){if(e?.message?.includes('HTTPS'))throw e;throw new Error('PRO4X4_ASSET_S3_ENDPOINT must be a valid HTTP(S) URL')}
  }
  if(cfg.assetCdnBaseUrl){try{const u=new URL(cfg.assetCdnBaseUrl);if(!/^https?:$/.test(u.protocol))throw new Error();if(production&&u.protocol!=='https:')throw new Error('PRO4X4_ASSET_CDN_BASE_URL must use HTTPS in production');cfg.assetCdnBaseUrl=u.toString().replace(/\/$/,'')}catch(e){if(e?.message?.includes('HTTPS'))throw e;throw new Error('PRO4X4_ASSET_CDN_BASE_URL must be a valid HTTP(S) URL')}}
  if(String(cfg.assetDeliverySecret).length<32)throw new Error('PRO4X4_ASSET_DELIVERY_SECRET must be at least 32 characters when explicitly configured');
  return cfg;
}
module.exports={loadConfig,ROOT};
