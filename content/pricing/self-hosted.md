+++
title = "Pricing for self-hosted solution"

pricingmenu = "self"
lead = "Manage your own deployment."
+++

<div class="pt-12"></div>
<div class="relative bg-white">
  <div class="absolute inset-0" aria-hidden="true">
    <div class="mt-12 absolute inset-y-0 right-0 w-1/2 bg-gray-800"></div>
  </div>
  <div class="relative max-w-7xl mx-auto lg:px-8 lg:grid lg:grid-cols-2">
    <div class="bg-white py-16 px-4 sm:py-24 sm:px-6 lg:px-0 lg:pr-8">
      <div class="max-w-lg mx-auto lg:mx-0">
        <h2 class="text-base font-semibold tracking-wide text-sb uppercase">
          On your infrastructure
        </h2>
        <p class="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
					High performance is limited only by your infrastructure
				</p>
        <dl class="mt-12 space-y-10">
          <div class="flex">
            <div class="ml-4">
              <dt class="text-lg leading-6 font-medium text-gray-900">
                No database document limit
              </dt>
              <dd class="mt-2 text-base text-gray-500">
                Host your database server(s) and remove the database document 
								limits from our managed plans.
              </dd>
            </div>
          </div>
          <div class="flex">
            <div class="ml-4">
              <dt class="text-lg leading-6 font-medium text-gray-900">
                Virtually no WebSocket limit
              </dt>
              <dd class="mt-2 text-base text-gray-500">
								StaticBackend server is a Go web server that can handle hundreds 
								of thousands of concurrent WebSocket connections.
              </dd>
            </div>
          </div>
          <div class="flex">
            <div class="ml-4">
              <dt class="text-lg leading-6 font-medium text-gray-900">
                Use it in your CI process
              </dt>
              <dd class="mt-2 text-base text-gray-500">
                The web server is a single cross-platform binary you may use in 
								your CI workflow and test against a real server before deploying 
								your applications.
              </dd>
            </div>
          </div>
          <div class="flex">
            <div class="ml-4">
              <dt class="text-lg leading-6 font-medium text-gray-900">
                Requirements
              </dt>
              <dd class="mt-2 text-base text-gray-500">
                An x64 Linux server, a Redis server, a MongoDB 4+ server, and 
								an AWS account.
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
    <div class="bg-gray-800 py-16 px-4 sm:py-24 sm:px-6 lg:bg-none lg:px-0 lg:pl-8 lg:flex lg:items-center lg:justify-end">
      <div class="max-w-lg mx-auto w-full space-y-8 lg:mx-0">
        <div>
          <h2 class="sr-only">Price</h2>
          <p class="relative grid grid-cols-2">
            <span class="flex flex-col text-center">
              <span class="text-5xl font-extrabold text-white tracking-tight">$499</span>
              <span class="mt-2 text-base font-medium text-gray-100">Initial purchase</span>
              <span class="sr-only">plus</span>
            </span>
            <span class="pointer-events-none absolute h-12 w-full flex items-center justify-center" aria-hidden="true">
            </span>
            <span>
              <span class="flex flex-col text-center">
                <span class="text-5xl font-extrabold text-white tracking-tight">$329</span>
                <span class="mt-2 text-base font-medium text-gray-100">Per year</span>
              </span>
            </span>
          </p>
        </div>
        <ul class="bg-gray-600 bg-opacity-50 rounded sm:grid sm:grid-cols-2 sm:grid-rows-3 sm:grid-flow-col">
          <li class="py-4 px-4 flex items-center space-x-3 text-base text-white">
            <span>self-hosted license</span>
          </li>
          <li class="border-t border-gray-800 border-opacity-25 py-4 px-4 flex items-center space-x-3 text-base text-white">
            <span>5 applications</span>
          </li>
          <li class="border-t border-gray-800 border-opacity-25 py-4 px-4 flex items-center space-x-3 text-base text-white">
            <span>use your infrastructure</span>
          </li>
          <li class="border-t border-gray-800 border-opacity-25 py-4 px-4 flex items-center space-x-3 text-base text-white sm:border-t-0 sm:border-l">
            <span>12 months of updates</span>
          </li>
          <li class="border-t border-gray-800 border-opacity-25 py-4 px-4 flex items-center space-x-3 text-base text-white sm:border-l">
            <span>12 months of support</span>
          </li>
          <li class="border-t border-gray-800 border-opacity-25 py-4 px-4 flex items-center space-x-3 text-base text-white sm:border-l">
            <span>Deployment support</span>
          </li>
        </ul>
        <a href="/contact/" class="bg-sb border border-transparent rounded-md w-full px-8 py-4 flex items-center justify-center text-lg leading-6 font-medium text-white hover:bg-red-500 md:px-10">
          Buy a self-hosted license
        </a>
      </div>
    </div>
  </div>
</div>

<div class="pt-20 prose prose-lg max-w-5xl mx-auto">
	<h3>Why would you want to self-host?</h3>
	<p>
		Sometimes your product needs the power of dedicated hardware, and as you 
		grow, you might want to have more control over your infrastructure.
	</p>
	<p>
		We created StaticBackend, keeping in mind that our platform should be easy 
		to get started with via managed services. But when the time comes for a 
		company to take ownership of its infrastructure, it would be possible. 
		We've got your back covered, here's our self-hosted solution.
	</p>
	<div class="py-8 lg:flex">
		<div class="w-full lg:w-1/2 lg:pr-4">
			<h3>Is it complicated to deploy?</h3>
			<p>
				A Linux server is required. Either behind a load balancer or a reverse 
				proxy server like nginx. A Redis and MongoDB servers accessible from the 
				server hosting the StaticBackend process. Ideally, you want a cluster 
				for your MongoDB servers. If the basics sound familiar, you should not 
				have an issue with the deployment.
			</p>
			<p>
				You may have a look at our documentation on how to run your instance. 
				We have a sample binary you may use that replicates the connection the 
				real process does.
			</p>
		</div>
		<div class="w-full lg:w-1/2 lg:pl-4">
			<h3>How can we get updated versions?</h3>
			<p>
				Your initial purchase comes with 12 months of free updates and support. 
				If you want to keep getting updates and support, you'll need to renew 
				your license each year.
			</p>
			<p>
				At any time, you may download the latest version of the binary. We're 
				offering two versions, one is the latest bleeding-edge, and the other 
				is the stable one. The stable release has been running for at least one 
				month in our managed environment.
			</p>
		</div>
	</div>
</div>