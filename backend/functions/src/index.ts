import { onRequest } from "firebase-functions/v2/https";
import * as tls from "tls";

interface CertificateInfo {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  isValid: boolean;
}

// 証明書取得のヘルパー関数
function getCertificateInfo(hostname: string): Promise<CertificateInfo> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host: hostname,
        port: 443,
        servername: hostname, // SNI対応
        rejectUnauthorized: false, // 自己署名などを許容（情報取得優先）
      },
      () => {
        const cert = socket.getPeerCertificate();

        if (!cert || Object.keys(cert).length === 0) {
          socket.end();
          return reject(new Error("No certificate found"));
        }

        const validTo = new Date(cert.valid_to);
        const validFrom = new Date(cert.valid_from);
        const daysRemaining = Math.floor(
          (validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );

        resolve({
          subject: cert.subject.CN || "",
          issuer: cert.issuer.O || cert.issuer.CN || "",
          validFrom: validFrom.toISOString(),
          validTo: validTo.toISOString(),
          daysRemaining,
          isValid: daysRemaining > 0,
        });

        socket.end();
      },
    );

    socket.on("error", (err) => {
      reject(new Error(`Connection failed: ${err.message}`));
    });

    // タイムアウト設定 (10秒)
    socket.setTimeout(10000, () => {
      socket.destroy();
      reject(new Error("Connection timed out"));
    });
  });
}

export const sslCertChecker = onRequest(
  {
    cors: true,
    region: "asia-northeast1",
    // enforceAppCheck: true, // App Check トークンを検証
  },
  async (req, res) => {
    const domain = req.query.domain as string;

    if (!domain) {
      res.status(400).json({ error: "Domain is required" });
      return;
    }

    // ホスト名のみを抽出（https:// などを除去）
    const hostname = domain
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .split(":")[0];

    try {
      const certInfo = await getCertificateInfo(hostname);
      res.json(certInfo);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch certificate";
      res.status(500).json({ error: message });
    }
  },
);
