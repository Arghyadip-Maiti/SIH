export const EmblemIcon = ({ className = "w-9 h-9", color = "text-amber-400" }) => {
  return (
    <svg
      viewBox="0 0 100 120"
      className={`${className} ${color}`}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Three Lions Top Contour */}
      <path d="M50 4 C43 4 37 9 37 16 C37 19 38 22 40 24 C36 25 33 28 32 32 C30 36 31 41 34 45 C30 47 28 51 29 56 C30 61 34 65 40 66 L38 72 H62 L60 66 C66 65 70 61 71 56 C72 51 70 47 66 45 C69 41 70 36 68 32 C67 28 64 25 60 24 C62 22 63 19 63 16 C63 9 57 4 50 4 Z" />
      {/* Lion Mane & Facial Detail Cutouts */}
      <circle cx="50" cy="16" r="4" fill="#050D24" />
      <path d="M44 26 C47 28 53 28 56 26" stroke="#050D24" strokeWidth="2" fill="none" />
      <path d="M38 38 C42 41 46 41 48 38" stroke="#050D24" strokeWidth="1.5" fill="none" />
      <path d="M52 38 C54 41 58 41 62 38" stroke="#050D24" strokeWidth="1.5" fill="none" />
      
      {/* Abacus Platform */}
      <rect x="24" y="72" width="52" height="10" rx="2" />
      
      {/* Ashoka Chakra in Center of Abacus */}
      <circle cx="50" cy="77" r="4.5" fill="#050D24" />
      <circle cx="50" cy="77" r="2" fill="currentColor" />
      
      {/* Bull and Horse Accents */}
      <circle cx="33" cy="77" r="1.5" fill="#050D24" />
      <circle cx="67" cy="77" r="1.5" fill="#050D24" />

      {/* Bell Lotus Base */}
      <path d="M28 84 C28 84 34 98 50 98 C66 98 72 84 72 84 H28 Z" />
      
      {/* Satyameva Jayate Base Plinth */}
      <rect x="20" y="100" width="60" height="7" rx="1.5" />
    </svg>
  );
};
