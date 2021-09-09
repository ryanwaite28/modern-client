import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { REACTION_TYPES } from '../enums/all.enums';
import { PlainObject } from '../interfaces/json-object.interface';
import {
  GetRecordResponse,
  PutRecordResponse,
  DeleteRecordResponse,
  PostRecordResponse
} from '../interfaces/responses.interface';
import { IRecipe } from '../interfaces/_all.interface';
import { IReactionsCounts } from '../interfaces/_common.interface';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(
    private clientService: ClientService,
  ) {}

  get_recipe(recipe_id: number | string) {
    return this.clientService.sendRequest<GetRecordResponse<IRecipe>>(`/recipes/${recipe_id}`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_recipe_comments_count(recipe_id: number | string) {
    return this.clientService.sendRequest<GetRecordResponse<any>>(`/recipes/${recipe_id}/comments/count`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_recipe_reactions_count(recipe_id: number | string) {
    return this.clientService.sendRequest<GetRecordResponse<IReactionsCounts>>(`/recipes/${recipe_id}/user-reactions/count`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_reaction(params: { recipe_id: number; user_id: number; }) {
    const { recipe_id, user_id } = params;
    return this.clientService.sendRequest<GetRecordResponse<any>>(`/recipes/${recipe_id}/user-reaction/${user_id}`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_recipe(data: PlainObject) {
    return this.clientService.sendRequest<PostRecordResponse<IRecipe>>(`/recipes`, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_recipe(params: { recipe_id: number; data: PlainObject }) {
    const { recipe_id, data } = params;
    return this.clientService.sendRequest<PutRecordResponse<IRecipe>>(`/recipes/${recipe_id}`, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_recipe_ingredient(params: { recipe_id: number; ingredient_id: number; data: PlainObject }) {
    const { recipe_id, ingredient_id, data } = params;
    return this.clientService.sendRequest<PutRecordResponse<IRecipe>>(`/recipes/${recipe_id}/ingredients/${ingredient_id}`, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  delete_recipe(recipe_id: number) {
    return this.clientService.sendRequest<DeleteRecordResponse>(`/recipes/${recipe_id}`, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  delete_recipe_ingredient(recipe_id: number, ingredient_id: number) {
    return this.clientService.sendRequest<DeleteRecordResponse>(`/recipes/${recipe_id}/ingredients/${ingredient_id}`, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  toggle_user_reaction(params: { recipe_id: number; data: { reaction: REACTION_TYPES } }) {
    const { recipe_id, data } = params;
    return this.clientService.sendRequest<PutRecordResponse<any>>(`/recipes/${recipe_id}/user-reaction`, `PUT`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }
}