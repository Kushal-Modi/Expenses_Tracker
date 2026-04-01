import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private themeSubject = new BehaviorSubject<string>('dark');
  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  private setTheme(theme: string): void {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem(this.THEME_KEY, theme);
    this.themeSubject.next(theme);
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) || 'dark';
    this.setTheme(savedTheme);
  }
}
