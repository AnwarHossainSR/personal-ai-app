#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const moduleName = process.argv[2];

if (!moduleName) {
  console.error("Please provide a module name: npm mod:new <name>");
  process.exit(1);
}

const moduleId = moduleName.toLowerCase().replace(/\s+/g, "-");
const pascalName = moduleName
  .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
  .replace(/\s+/g, "");

// Create module directory structure
const moduleDir = path.join("modules", moduleId);
const appModuleDir = path.join("app", "(modules)", moduleId);

const directories = [
  moduleDir,
  path.join(moduleDir, "models"),
  path.join(moduleDir, "repositories"),
  path.join(moduleDir, "services"),
  path.join(moduleDir, "actions"),
  path.join(moduleDir, "validators"),
  path.join(moduleDir, "ui"),
  appModuleDir,
  path.join("tests", "modules", moduleId, "services"),
];

directories.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Template files
const templates = {
  // Module model
  [`modules/${moduleId}/models/index.ts`]: `import { Schema } from 'mongoose';
import { createModel, BaseDocument } from '@/lib/db/modelFactory';

export interface I${pascalName} extends BaseDocument {
  user_id: string;
  name: string;
  description?: string;
}

const ${moduleId}Schema = new Schema<I${pascalName}>({
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

export const ${pascalName} = createModel<I${pascalName}>('${pascalName}', ${moduleId}Schema);
`,

  // Module repository
  [`modules/${moduleId}/repositories/index.ts`]: `import { ${pascalName}, I${pascalName} } from '../models';
import dbConnect from '@/lib/db/connection';

export class ${pascalName}Repository {
  static async findByUserId(userId: string): Promise<I${pascalName}[]> {
    await dbConnect();
    return ${pascalName}.find({ user_id: userId }).sort({ created_at: -1 });
  }

  static async findById(id: string, userId: string): Promise<I${pascalName} | null> {
    await dbConnect();
    return ${pascalName}.findOne({ _id: id, user_id: userId });
  }

  static async create(data: Partial<I${pascalName}>): Promise<I${pascalName}> {
    await dbConnect();
    const item = new ${pascalName}(data);
    return item.save();
  }

  static async update(id: string, userId: string, data: Partial<I${pascalName}>): Promise<I${pascalName} | null> {
    await dbConnect();
    return ${pascalName}.findOneAndUpdate(
      { _id: id, user_id: userId },
      data,
      { new: true }
    );
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    await dbConnect();
    const result = await ${pascalName}.deleteOne({ _id: id, user_id: userId });
    return result.deletedCount > 0;
  }
}
`,

  // Module service
  [`modules/${moduleId}/services/index.ts`]: `import { ${pascalName}Repository } from '../repositories';
import { I${pascalName} } from '../models';

export class ${pascalName}Service {
  static async getAll(userId: string): Promise<I${pascalName}[]> {
    return ${pascalName}Repository.findByUserId(userId);
  }

  static async getById(id: string, userId: string): Promise<I${pascalName} | null> {
    return ${pascalName}Repository.findById(id, userId);
  }

  static async create(data: Partial<I${pascalName}>, userId: string): Promise<I${pascalName}> {
    return ${pascalName}Repository.create({ ...data, user_id: userId });
  }

  static async update(id: string, userId: string, data: Partial<I${pascalName}>): Promise<I${pascalName} | null> {
    return ${pascalName}Repository.update(id, userId, data);
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    return ${pascalName}Repository.delete(id, userId);
  }
}
`,

  // Module page
  [`app/(modules)/${moduleId}/page.tsx`]: `import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ${pascalName}Page() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">${moduleName}</h1>
          <p className="text-muted-foreground">
            Manage your ${moduleName.toLowerCase()} data and settings.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>${moduleName} Dashboard</CardTitle>
            <CardDescription>
              Welcome to the ${moduleName.toLowerCase()} module. This is your starting point.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Module functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
`,

  // Test file
  [`tests/modules/${moduleId}/services/${moduleId}-service.test.ts`]: `import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ${pascalName}Service } from '@/modules/${moduleId}/services'

// Mock database connection
vi.mock('@/lib/db/connection', () => ({
  default: vi.fn(),
}))

describe('${pascalName}Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should return all ${moduleId} items for a user', async () => {
      // Test implementation
      expect(true).toBe(true)
    })
  })

  describe('create', () => {
    it('should create a new ${moduleId} item', async () => {
      // Test implementation
      expect(true).toBe(true)
    })
  })
})
`,
};

// Write template files
Object.entries(templates).forEach(([filePath, content]) => {
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
});

console.log(`\n✅ Module "${moduleName}" created successfully!`);
console.log(`\n📁 Files created:`);
console.log(`   - modules/${moduleId}/`);
console.log(`   - app/(modules)/${moduleId}/`);
console.log(`   - tests/modules/${moduleId}/`);
console.log(`\n🔧 Next steps:`);
console.log(`   1. Add the module to modules/registry.ts`);
console.log(`   2. Implement your business logic in the service layer`);
console.log(`   3. Create UI components in modules/${moduleId}/ui/`);
console.log(`   4. Add API routes if needed`);
console.log(`   5. Write tests for your module`);
