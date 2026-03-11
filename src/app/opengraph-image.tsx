import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Lynq — Employer Dashboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(6, 182, 212, 0.15)",
            filter: "blur(100px)",
            top: -100,
            right: -50,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(251, 146, 60, 0.1)",
            filter: "blur(100px)",
            bottom: -100,
            left: -50,
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 48,
          }}
        >
          {/* Lynq Icon */}
          <svg
            width="160"
            height="160"
            viewBox="0 0 1200 1200"
            fill="none"
          >
            <path
              d="M0 977.067V1.37076C161.691 -12.6483 220.253 84.3169 229.322 134.552V777.298H454.757L349.813 977.067H0Z"
              fill="#06B6D4"
            />
            <path
              d="M1200 456.99V1200H1126.15C1020.43 1183.18 983.631 1094.86 978.448 1052.8V947.657C791.881 1026.16 667.922 963.645 608.324 921.588L752.136 767.378C914.474 797.44 978.448 729.573 978.448 670.781V492.038C970.923 298.616 699.967 325.763 682.173 427.416L523.094 507.308L617.176 573.478C590.833 607.412 534.383 682.066 511.804 702.426C489.224 722.786 470.99 737.004 460.625 739.34C242.964 52.406 1126.15 -54.7061 1200 456.99Z"
              fill="#06B6D4"
            />
            <path
              d="M446.984 777.326L342.04 977.098C361.474 977.098 429.882 972.892 501.4 961.677C572.917 950.462 668.533 888.077 699.627 849.524L831.779 646.248L928.949 688.305L866.76 397.409L583.023 509.562L668.533 562.133C624.482 622.883 536.381 746.484 536.381 754.896C536.381 763.307 475.488 772.653 446.984 777.326Z"
              fill="#FB923C"
            />
          </svg>

          {/* Text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: "white",
                letterSpacing: -2,
                lineHeight: 1,
              }}
            >
              Lynq
            </div>
            <div
              style={{
                fontSize: 28,
                color: "rgba(255, 255, 255, 0.6)",
                letterSpacing: -0.5,
              }}
            >
              Your hiring command center
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
