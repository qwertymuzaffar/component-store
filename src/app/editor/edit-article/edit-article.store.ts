import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OnStoreInit, tapResponse } from '@ngrx/component-store';
import { exhaustMap, switchMap } from 'rxjs';
import { Article, ErrorResponse } from "../../shared/models";
import { ComponentStoreWithSelectors, TypedFormGroup } from "../../shared/utils";
import { ArticleService, UpsertArticleBodyRequest } from "../../shared/services";
import { AuthStore } from "../../shared/store";

interface EditArticleState {
  article: Article;
  errorResponse: ErrorResponse | null;
}

@Injectable()
export class EditArticleStore
  extends ComponentStoreWithSelectors<EditArticleState>
  implements OnStoreInit
{
  readonly #articleService = inject(ArticleService);
  readonly #router = inject(Router);
  readonly #authStore = inject(AuthStore);

  ngrxOnStoreInit(): void {
    this.setState({
      errorResponse: null,
      article: {} as Article,
    });
  }

  readonly getArticle = this.effect<string>(
    switchMap((slug) =>
      this.#articleService.getArticleDetail(slug).pipe(
        tapResponse(
          (response) => {
            this.patchState({
              article: response.article,
            });
          },
          (error) => {
            console.error(`Get article ${slug} failed`, error);
            this.#router.navigate(['/']);
          }
        )
      )
    )
  );

  readonly updateArticle = this.effect<
    TypedFormGroup<UpsertArticleBodyRequest>
  >(
    exhaustMap((form) => {
      form.disable();
      return this.#articleService
        .updateArticle(this.selectors.article().slug, form.getRawValue())
        .pipe(
          tapResponse(
            (response) => {
              if (response && response.article) {
                this.#router.navigate(['/article', response.article.slug]);
              } else {
                this.#router.navigate([
                  '/profile',
                  this.#authStore.selectors.user()?.username,
                ]);
              }
            },
            (error: HttpErrorResponse) => {
              this.patchState({
                errorResponse: error.error,
              });
            },
            () => {
              form.enable();
            }
          )
        );
    })
  );
}
