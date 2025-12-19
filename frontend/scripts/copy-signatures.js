const fs = require('fs')
const path = require('path')

// Copy signatures from claimerV1-tools to public folder
const sourcePath = path.join(__dirname, '../../claimerV1-tools/output-sig.json')
const destPath = path.join(__dirname, '../public/signatures.json')

try {
  if (fs.existsSync(sourcePath)) {
    const signatures = fs.readFileSync(sourcePath, 'utf8')
    fs.writeFileSync(destPath, signatures)
    console.log('✅ Signatures copied successfully!')
  } else {
    console.warn('⚠️  Source signatures file not found:', sourcePath)
  }
} catch (error) {
  console.error('❌ Error copying signatures:', error)
}

