const fs = require('fs');

let content = fs.readFileSync('src/pages/Overview/OverviewPage.jsx', 'utf8');

const target = `      {/* 10. High Level Attention Items & AI Insights */}
      <HighLevelAttentionSection
        highLevelAttention={highLevelAttention}
        aiInsights={aiInsights}
      />
    </div>
  );
};`;

const replacement = `      {/* 10. High Level Attention Items & AI Insights */}
      <HighLevelAttentionSection
        highLevelAttention={highLevelAttention}
        aiInsights={aiInsights}
      />
        </div>
      )}
    </div>
  );
};`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Overview/OverviewPage.jsx', content);
