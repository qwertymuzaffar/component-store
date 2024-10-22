import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { OnStoreInit, tapResponse } from '@ngrx/component-store';
import { exhaustMap } from 'rxjs';
import { ErrorResponse } from "../../shared/models";
import { ComponentStoreWithSelectors, TypedFormGroup } from "../../shared/utils";
import { AuthStore } from "../../shared/store";
import { ArticleService, UpsertArticleBodyRequest } from "../../shared/services";

interface NewArticleState {
  errorResponse: ErrorResponse | null;
}

@Injectable()
export class NewArticleStore
  extends ComponentStoreWithSelectors<NewArticleState>
  implements OnStoreInit
{
  readonly #router = inject(Router);
  readonly #authStore = inject(AuthStore);
  readonly #articleService = inject(ArticleService);
  ngrxOnStoreInit(): void {
    this.setState({
      errorResponse: null,
    });
  }

  readonly createNewArticle = this.effect<
    TypedFormGroup<UpsertArticleBodyRequest>
  >(
    exhaustMap((form) => {
      form.disable();
      return this.#articleService.createArticle(form.getRawValue()).pipe(
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
