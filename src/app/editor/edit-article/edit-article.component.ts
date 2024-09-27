import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { EditArticleStore } from './edit-article.store';
import { TypedFormGroup } from "../../shared/utils";
import { UpsertArticleBodyRequest } from "../../shared/services";

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [ArticleFormComponent],
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(EditArticleStore)],
})
export default class EditArticleComponent implements OnInit {
  @Input() slug!: string;
  readonly #editArticleStore = inject(EditArticleStore);
  readonly errorResponse = this.#editArticleStore.selectors.errorResponse;
  readonly article = this.#editArticleStore.selectors.article;

  ngOnInit(): void {
    this.#editArticleStore.getArticle(this.slug);
  }

  submit(form: TypedFormGroup<UpsertArticleBodyRequest>): void {
    this.#editArticleStore.updateArticle(form);
  }
}
