'use client';
import EnhancedPaginationExample from '@/components/examples/enhanced-pagination-example';
import { Badge } from '@/components/ui/badge/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/pagination/data-table-pagination';
import { EnhancedPagination } from '@/components/ui/pagination/enhanced-pagination';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tab/tabs';
import { Typography } from '@/components/ui/typography';

export default function PaginationShowcase() {
  return (
    <div className='container mx-auto py-8 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <Typography variant='h1' className='text-4xl font-bold'>
          Pagination System
        </Typography>
        <Typography
          variant='body1'
          className='text-muted-foreground max-w-2xl mx-auto'
        >
          A comprehensive, flexible pagination system with multiple variants,
          built-in state management, and seamless integration with data tables.
          Perfect for any React application.
        </Typography>

        {/* Feature badges */}
        <div className='flex flex-wrap justify-center gap-2 mt-6'>
          <Badge variant='filled' status='active'>
            Multiple Variants
          </Badge>
          <Badge variant='pastel' status='info'>
            State Management
          </Badge>
          <Badge variant='outlined'>Data Table Integration</Badge>
          <Badge variant='outlined'>Accessible</Badge>
          <Badge variant='outlined'>Responsive</Badge>
          <Badge variant='outlined'>TypeScript</Badge>
        </div>
      </div>

      <Separator />

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <Typography variant='body2' className='text-muted-foreground'>
            Get started with pagination in just a few lines of code.
          </Typography>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Typography variant='h6'>Basic Usage</Typography>
              <pre className='bg-muted p-4 rounded-lg text-sm overflow-x-auto'>
                {`import { EnhancedPagination } from '@/components/ui/pagination/enhanced-pagination';

function MyComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  return (
    <EnhancedPagination
      totalItems={1000}
      initialPage={currentPage}
      initialPageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
    />
  );
}`}
              </pre>
            </div>

            <div className='space-y-2'>
              <Typography variant='h6'>With Hook</Typography>
              <pre className='bg-muted p-4 rounded-lg text-sm overflow-x-auto'>
                {`import { useEnhancedPagination } from '@/hooks/use-enhanced-pagination';

function MyComponent() {
  const pagination = useEnhancedPagination({
    totalItems: 1000,
    initialPageSize: 10,
  });

  return (
    <EnhancedPagination
      totalItems={1000}
      onPageChange={pagination.setPage}
      onPageSizeChange={pagination.setPageSize}
    />
  );
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variants Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Variants</CardTitle>
          <Typography variant='body2' className='text-muted-foreground'>
            Choose from three different visual variants to match your design
            needs.
          </Typography>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Tabs defaultValue='default' className='w-full'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='default'>Default</TabsTrigger>
              <TabsTrigger value='compact'>Compact</TabsTrigger>
              <TabsTrigger value='minimal'>Minimal</TabsTrigger>
            </TabsList>

            <TabsContent value='default' className='space-y-4'>
              <div className='space-y-2'>
                <Typography variant='h6'>Default Variant</Typography>
                <Typography variant='body2' className='text-muted-foreground'>
                  Full-featured pagination with card wrapper, page info, item
                  count, and page size selector.
                </Typography>
              </div>
              <EnhancedPagination
                totalItems={1000}
                initialPageSize={10}
                showPageSizeSelector={true}
                showItemCount={true}
                showPageInfo={true}
              />
            </TabsContent>

            <TabsContent value='compact' className='space-y-4'>
              <div className='space-y-2'>
                <Typography variant='h6'>Compact Variant</Typography>
                <Typography variant='body2' className='text-muted-foreground'>
                  Streamlined pagination without card wrapper, suitable for
                  tight spaces.
                </Typography>
              </div>
              <EnhancedPagination
                totalItems={1000}
                initialPageSize={10}
                variant='compact'
                showPageSizeSelector={true}
                showItemCount={true}
                showPageInfo={false}
              />
            </TabsContent>

            <TabsContent value='minimal' className='space-y-4'>
              <div className='space-y-2'>
                <Typography variant='h6'>Minimal Variant</Typography>
                <Typography variant='body2' className='text-muted-foreground'>
                  Basic pagination controls only, perfect for simple use cases.
                </Typography>
              </div>
              <EnhancedPagination
                totalItems={1000}
                initialPageSize={10}
                variant='minimal'
                showPageSizeSelector={false}
                showItemCount={false}
                showPageInfo={false}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Usage Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Patterns</CardTitle>
          <Typography variant='body2' className='text-muted-foreground'>
            Common implementation patterns for different use cases.
          </Typography>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='list' className='w-full'>
            <TabsList className='grid w-full grid-cols-4'>
              <TabsTrigger value='list'>List</TabsTrigger>
              <TabsTrigger value='grid'>Grid</TabsTrigger>
              <TabsTrigger value='table'>Table</TabsTrigger>
              <TabsTrigger value='custom'>Custom</TabsTrigger>
            </TabsList>

            <TabsContent value='list' className='space-y-4'>
              <div className='space-y-2'>
                <Typography variant='h6'>List Pagination</Typography>
                <Typography variant='body2' className='text-muted-foreground'>
                  Paginate a simple list of items with search and filtering.
                </Typography>
              </div>
              <EnhancedPaginationExample />
            </TabsContent>

            <TabsContent value='grid' className='space-y-4'>
              <div className='space-y-2'>
                <Typography variant='h6'>Grid Layout</Typography>
                <Typography variant='body2' className='text-muted-foreground'>
                  Paginate items in a responsive grid layout.
                </Typography>
              </div>
              <div className='space-y-4'>
                {/* Mock grid content */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className='p-4 border rounded-lg bg-muted/50'>
                      <Typography variant='body2' className='font-medium'>
                        Item {i + 1}
                      </Typography>
                      <Typography
                        variant='small'
                        className='text-muted-foreground'
                      >
                        Description for item {i + 1}
                      </Typography>
                    </div>
                  ))}
                </div>

                <EnhancedPagination
                  totalItems={100}
                  initialPageSize={8}
                  variant='compact'
                  showPageSizeSelector={true}
                  showItemCount={true}
                  showPageInfo={false}
                />
              </div>
            </TabsContent>

            <TabsContent value='table' className='space-y-4'>
              <div className='space-y-2'>
                <Typography variant='h6'>Data Table Integration</Typography>
                <Typography variant='body2' className='text-muted-foreground'>
                  Seamless integration with TanStack Table and other data table
                  libraries.
                </Typography>
              </div>
              <div className='space-y-4'>
                {/* Mock table */}
                <div className='border rounded-lg overflow-hidden'>
                  <div className='bg-muted/50 px-4 py-3 border-b'>
                    <Typography variant='small' className='font-medium'>
                      Users (1-10 of 100)
                    </Typography>
                  </div>
                  <div className='divide-y'>
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className='px-4 py-3'>
                        <div className='flex items-center justify-between'>
                          <div>
                            <Typography variant='body2' className='font-medium'>
                              User {i + 1}
                            </Typography>
                            <Typography
                              variant='small'
                              className='text-muted-foreground'
                            >
                              user{i + 1}@example.com
                            </Typography>
                          </div>
                          <Badge variant='outlined'>Active</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <DataTablePagination
                  currentPage={1}
                  totalPages={10}
                  pageSize={10}
                  totalItems={100}
                  pageSizeOptions={[5, 10, 20, 50]}
                  onPageChange={() => {}}
                  onPageSizeChange={() => {}}
                />
              </div>
            </TabsContent>

            <TabsContent value='custom' className='space-y-4'>
              <div className='space-y-2'>
                <Typography variant='h6'>Custom UI</Typography>
                <Typography variant='body2' className='text-muted-foreground'>
                  Build custom pagination UI using the hook directly.
                </Typography>
              </div>
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-4 border rounded-lg'>
                  <Typography variant='small' className='text-muted-foreground'>
                    Showing 1-10 of 100 items
                  </Typography>

                  <div className='flex items-center gap-2'>
                    <button className='px-3 py-1 text-sm border rounded disabled:opacity-50'>
                      Previous
                    </button>

                    <div className='flex gap-1'>
                      <button className='px-3 py-1 text-sm border rounded bg-primary texd'>
                        1
                      </button>
                      <button className='px-3 py-1 text-sm border rounded'>
                        2
                      </button>
                      <button className='px-3 py-1 text-sm border rounded'>
                        3
                      </button>
                    </div>

                    <button className='px-3 py-1 text-sm border rounded'>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Features */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <span className='text-2xl'>🎨</span>
              Multiple Variants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant='body2' className='text-muted-foreground'>
              Choose from default, compact, and minimal variants to match your
              design requirements.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <span className='text-2xl'>🔄</span>
              State Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant='body2' className='text-muted-foreground'>
              Built-in state management with hooks for complete pagination logic
              and utilities.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <span className='text-2xl'>📊</span>
              Data Table Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant='body2' className='text-muted-foreground'>
              Seamless integration with TanStack Table and other data table
              libraries.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <span className='text-2xl'>🎯</span>
              Flexible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant='body2' className='text-muted-foreground'>
              Works with any data source - tables, lists, grids, cards, and
              more.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <span className='text-2xl'>♿</span>
              Accessible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant='body2' className='text-muted-foreground'>
              Full ARIA support, keyboard navigation, and screen reader
              friendly.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <span className='text-2xl'>⚡</span>
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant='body2' className='text-muted-foreground'>
              Optimized with React hooks, memoization, and efficient re-renders.
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* API Reference */}
      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <Typography variant='body2' className='text-muted-foreground'>
            Complete API documentation for all pagination components and hooks.
          </Typography>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <Typography variant='h6'>EnhancedPagination Props</Typography>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <code className='bg-muted px-2 py-1 rounded'>totalItems</code>
                  <span className='text-muted-foreground'>
                    number (required)
                  </span>
                </div>
                <div className='flex justify-between'>
                  <code className='bg-muted px-2 py-1 rounded'>
                    initialPageSize
                  </code>
                  <span className='text-muted-foreground'>
                    number (default: 10)
                  </span>
                </div>
                <div className='flex justify-between'>
                  <code className='bg-muted px-2 py-1 rounded'>variant</code>
                  <span className='text-muted-foreground'>
                    'default' | 'compact' | 'minimal'
                  </span>
                </div>
                <div className='flex justify-between'>
                  <code className='bg-muted px-2 py-1 rounded'>
                    showPageSizeSelector
                  </code>
                  <span className='text-muted-foreground'>
                    boolean (default: true)
                  </span>
                </div>
                <div className='flex justify-between'>
                  <code className='bg-muted px-2 py-1 rounded'>
                    onPageChange
                  </code>
                  <span className='text-muted-foreground'>
                    (page: number) =&gt; void
                  </span>
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <Typography variant='h6'>useEnhancedPagination Hook</Typography>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <code className='bg-muted px-2 py-1 rounded'>
                    currentPage
                  </code>
                  <span className='text-muted-foreground'>number</span>
                </div>
                <div className='flex justify-between'>
                  <code className='bg-muted px-2 py-1 rounded'>pageSize</code>
                  <span className='text-muted-foreground'>number</span>
                </div>
                <div className='flex justify-between'>
                  <code className='bg-muted px-2 py-1 rounded'>totalPages</code>
                  <span className='text-muted-foreground'>number</span>
                </div>
                <div className='flex justify-between'>
                  <code className='bg-muted px-2 py-1 rounded'>setPage</code>
                  <span className='text-muted-foreground'>
                    (page: number) =&gt; void
                  </span>
                </div>
                <div className='flex justify-between'>
                  <code className='bg-muted px-2 py-1 rounded'>
                    goToNextPage
                  </code>
                  <span className='text-muted-foreground'>() =&gt; void</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
