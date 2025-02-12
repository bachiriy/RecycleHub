import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  template: `
    <footer class="bg-green-600 text-white">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold">RecycleHub</h3>
            <p class="mt-2 text-sm">Making recycling easier for everyone</p>
          </div>
          <div class="text-sm">
            <p>&copy; 2024 RecycleHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {} 