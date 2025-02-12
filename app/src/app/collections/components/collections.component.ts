import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../shared/components/base.component';

@Component({
  selector: 'app-collections',
  template: `...`
})
export class CollectionsComponent extends BaseComponent implements OnInit {
  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    // Example of proper subscription with cleanup
    this.store.select(selectSomeData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Handle data
      });
  }
} 